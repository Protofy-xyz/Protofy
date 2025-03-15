import { getServiceToken } from "../../apis/context"

const availableModels = [
    "fluentlylm-prinum",  //perfect score on tank v2 in 1.5s
    "qwen2.5-math-14b-instruct",  //1 fail in tank v2 in 1s
    "arcee-ai_virtuoso-small-v2", //perfect score on tankv2 in <1s (best so far)
    "tq2.5-14b-aletheia-v1", //perfect score on tank v2 (fails if flash attention is used) in 1s (near best)
    "tq2.5-14b-sugarquill-v1", //perfect score on tank v2 in 1s (near best)
]
const delay = (seconds: number) => new Promise((resolve) => setTimeout(resolve, seconds * 1000))

export const autopilot = ({context, app, agentName, model}) => {
    //Autopilot ------------------------------------
    let timer = null
    let lastChatMessage = null
    let firstRun = true
    let lastSeenRules = null
    let lastSeenState = null
    let jsCode = null
    let lastPrompt = null
    context.automations.automation({
      name: agentName+"/autopilot/step",
      description: "ai control automation",
      responseMode: "manual",
      app: app,
      onRun: async (params, res) => {
        const templateName = "v2";
        const actions = await context.automations.getActionsFromAutomations(agentName, context.serviceToken);
        const memoryStates = await context.protomemdb.getStatesFromProtoMemDB('states', 'boards', agentName);
        const chatStates = await context.chatbots.getChatState(context.serviceToken, 1);

        if((!lastChatMessage || chatStates.getData()?.chats[0]?.message?.message === lastChatMessage) && lastSeenState && JSON.stringify(lastSeenState) === JSON.stringify(memoryStates.getData())) {
          res.send({result: 'No new state detected, skipping step'})
          console.log('No new state detected, skipping step')
          return
        }

        // console.log('State: ', JSON.stringify(memoryStates.getData(), null, 4))
        lastSeenState = memoryStates.getData()
        let useDirectChat = false

        if(firstRun) {
          lastChatMessage = chatStates.getData()?.chats[0]?.message?.message
          firstRun = false
        }
        //filter already seen chat states
        if(chatStates.getData()?.chats[0]?.message?.message !== lastChatMessage) {
          useDirectChat = true
        } else {
          useDirectChat = false
        }
        let response = null
        if(!useDirectChat && templateName === "v2") {
          const {rules, chats, ...statesObj} = memoryStates.getDataObject() as any
          if(!jsCode || !lastSeenRules || JSON.stringify(lastSeenRules) !== JSON.stringify(rules)) {
            lastSeenRules = rules
            const prompt = await context.autopilot.getPrompt({
              templateName: templateName, actions, states: memoryStates
            });
            lastPrompt = prompt
            let reply = await context.lmstudio.chatWithModel(prompt, model)
            jsCode = reply.choices[0].message.content
          }

          const wrapper = new Function('states', `
            ${jsCode}
            return process_state(states);
          `);
          let urls = wrapper(statesObj);  
          response = {
            content: jsCode,
            urls: urls
          }
          urls = urls.map((url) => '/api/v1/automations/' + url)
          context.autopilot.fetchURLList(urls);

          if (params.raw) {
            res.send(lastPrompt + "\n\n" + response.content + "\n\n" + response.urls.join("\n"));
          } else {
            res.send({ 'result': lastPrompt + "\n\n" + response.content + "\n\n" + response.urls.join("\n") });
          }
        } else {
          console.log('use direct llm!!!!!!!')
          const prompt = await context.autopilot.getPrompt({
            templateName: "v1", actions, states: memoryStates.addState(chatStates)
          });
          console.log('memory states', memoryStates.getData())
          let reply = await context.lmstudio.chatWithModel(prompt, model)

          if(reply) {
              const response = context.autopilot.parseActionsResponse(reply);
              console.log('URLS: ', response.urls);
              lastChatMessage = chatStates.getData()?.chats[0]?.message?.message
              context.autopilot.fetchURLList(response.urls);
            
            if (params.raw) {
              res.send(prompt + "\n\n" + response.content + "\n\n" + response.urls.join("\n"));
            } else {
              res.send({ 'result': prompt + "\n\n" + response.content + "\n\n" + response.urls.join("\n") });
            }
          }
        }
      },
    });

    context.automations.automation({
      name: agentName+'/autopilot/add_rule',
      displayName: 'Add Rule',
      description: 'add a rule to the rules list',
      responseMode: 'manual',
      tags: [agentName],
      automationParams: {
        "rule": "Rule to add"
      },
      app: app,
      onRun: async (params, res) => {
        const rules = await context.state.get({ group: 'boards', tag: agentName, name: 'rules', defaultValue: [], token: getServiceToken() });
        //check if the rule is already in the list
        if (params.rule && params.rule.length > 1 && rules.indexOf(params.rule) === -1) {
          rules.push(params.rule);
          context.state.set({ group: 'boards', tag: agentName, name: 'rules', value: rules, emitEvent: true, token: getServiceToken() });
          res.send({result: 'rule added'});
        } else {
          res.send({result: 'rule already exists'});
        }
      }
    });

    context.automations.automation({
      name: agentName+'/autopilot/remove_rule',
      displayName: 'Remove Rule',
      description: 'remove a rule from the rules list',
      responseMode: 'manual',
      automationParams: {
        "rule": "id of the rule to remove. Starts from 0"
      },
      tags: [agentName],
      app: app,
      onRun: async (params, res) => {
        const rules = await context.state.get({ group: 'boards', tag: agentName, name: 'rules', defaultValue: [], token: getServiceToken() });
        const index = parseInt(params.rule);
        if (index > -1) {
          rules.splice(index, 1);
        }
        context.state.set({ group: 'boards', tag: agentName, name: 'rules', value: rules, emitEvent: true, token: getServiceToken() });
        res.send({result: 'rule removed'});
      }
    });

    context.automations.automation({
      name: agentName+'/autopilot/on',
      displayName: 'Autopilot ON',
      description: 'start ai control automation',
      responseMode: 'manual',
      tags: [agentName+'-user'],
      app: app,
      onRun: async (params, res) => {
        clearInterval(timer)
        context.state.set({ group: 'boards', tag: agentName, name: 'autopilot', value: 'ON', emitEvent: true, token: getServiceToken() });
        timer = setInterval(() => context.executeAutomation(agentName+'/autopilot/step', () => { }, () => { }), 100);
        res.send('ai control automation started');
      }
    });

    context.automations.automation({
      name: agentName+'/autopilot/off',
      displayName: 'Autopilot OFF',
      description: 'stop ai control automation',
      responseMode: 'manual',
      tags: [agentName+'-user'],
      app: app,
      onRun: async (params, res) => {
        context.state.set({ group: 'boards', tag: agentName, name: 'autopilot', value: 'OFF', emitEvent: true, token: getServiceToken() });
        clearInterval(timer);
        res.send('ai control automation disabled');
      }
    });

    context.automations.automation({
        name: agentName + "/skip",
        displayName: "Skip",
        description: "Execute this action to skip the current step because no action is needed",
        tags: [agentName],
        responseMode: "wait",
        app: app,
        onRun: async (params, res) => {
            await delay(parseInt(params.delay) || 0)
        }
    });
}