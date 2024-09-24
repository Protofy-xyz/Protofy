import { API } from "protobase";
import { AgentsModel } from ".";
import { AutoAPI, handler, getServiceToken } from 'protonode'
import { getDB } from '@my/config/dist/storageProviders';
import { generateEvent } from "../../events/eventsLibrary";
import { getLogger } from 'protobase';

export const AgentsAutoAPI = AutoAPI({
    modelName: 'Agents',
    modelType: AgentsModel,
    prefix: '/adminapi/v1/',
    skipDatabaseIndexes: true,
    useDatabaseEnvironment: false,
    useEventEnvironment: false
})

const logger = getLogger()


export const AgentsAPI = (app, context) => {
    const agentsPath = '../../data/agents/'
    const { topicSub, topicPub, mqtts } = context;
    AgentsAutoAPI(app, context)
    // agents topics: agents/[agentName]/[endpoint], en caso de no tener endpoint: agents/[agentName]
    /* examples
        agents/patata/switch/relay/actions/status
        agents/patata/button/relay/actions/status
        ...
    */
    app.get('/adminapi/v1/agents/:agent/subsystems/:subsystem/actions/:action/:value', handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB('agents')
        const agentInfo = AgentsModel.load(JSON.parse(await db.get(req.params.agent)), session)
        const env = agentInfo.getEnvironment()
        const subsystem = agentInfo.getSubsystem(req.params.subsystem)
        if (!subsystem) {
            res.status(404).send(`Subsytem [${req.params.subsystem}] not found in agent [${req.params.agent}]`)
            return
        }

        const action = subsystem.getAction(req.params.action)
        if (!action) {
            res.status(404).send(`Action [${req.params.action}] not found in Subsytem [${req.params.subsystem}] for agent [${req.params.agent}]`)
            return
        }

        topicPub(mqtts[env], action.getEndpoint(), req.params.value == "undefined" ? action.data.payload?.type == "json" ? JSON.stringify(action.getValue()) : action.getValue() : req.params.value)

        res.send({
            subsystem: req.params.subsystem,
            action: req.params.action,
            agent: req.params.agent,
            result: 'done'
        })
    }))

    app.get('/adminapi/v1/agents/:agent/subsystems/:subsystem/monitors/:monitor', handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB('agents')
        const agentInfo = AgentsModel.load(JSON.parse(await db.get(req.params.agent)), session)
        const env = agentInfo.getEnvironment()
        const subsystem = agentInfo.getSubsystem(req.params.subsystem)
        if (!subsystem) {
            res.status(404).send(`Subsytem [${req.params.subsystem}] not found in agent [${req.params.agent}]`)
            return
        }

        const monitor = subsystem.getMonitor(req.params.monitor)
        if (!monitor) {
            res.status(404).send(`Monitor [${req.params.monitor}] not found in Subsytem [${req.params.subsystem}] for agent [${req.params.agent}]`)
            return
        }

        const urlLastAgentEvent = `/adminapi/v1/events?env=${env}&filter[from]=agent&filter[user]=${req.params.agent}&filter[path]=${monitor.getEventPath()}&itemsPerPage=1&token=${session.token}&orderBy=created&orderDirection=desc`
        const data = await API.get(urlLastAgentEvent)

        if (!data || !data.data || !data.data['items'] || !data.data['items'].length) {
            res.status(404).send({ value: null })
            return
        }
        res.send({ value: data.data['items'][0]?.payload?.message })
    }))

    app.post('/adminapi/v1/agents/:agent/subsystems/:subsystem/monitors/:monitor/ephemeral', handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB('agents')
        const agentInfo = AgentsModel.load(JSON.parse(await db.get(req.params.agent)), session)
        const env = agentInfo.getEnvironment()
        const subsystem = agentInfo.getSubsystem(req.params.subsystem)
        if (!subsystem) {
            res.status(404).send(`Subsytem [${req.params.subsystem}] not found in agent [${req.params.agent}]`)
            return
        }

        const monitor = subsystem.getMonitor(req.params.monitor)
        if (!monitor) {
            res.status(404).send(`Monitor [${req.params.monitor}] not found in Subsytem [${req.params.subsystem}] for agent [${req.params.agent}]`)
            return
        }
        let { value } = req.body
        if (value == "true" || value == true) {
            value = true;
        } else {
            value = false;
        }
        const agent = agentInfo.setMonitorEphemeral(req.params.subsystem, req.params.monitor, value)
        if (agent) {
            await db.put(agent.getId(), JSON.stringify(agent.serialize(true)))
        }
        res.send({ value })
    }))

    const processMessage = async (env: string, message: string, topic: string) => {
        const splitted = topic.split("/");
        const agent = splitted[0];
        const agentName = splitted[1];
        const endpoint = splitted.slice(2).join("/")
        let parsedMessage = message;
        try {
            parsedMessage = JSON.parse(message);
        } catch (err) { }
        if (endpoint == 'debug') {
            logger.debug({ from: agent, agentName, endpoint }, JSON.stringify({ topic, message }))
        } else {
            const db = getDB('agents')
            const agentInfo = AgentsModel.load(JSON.parse(await db.get(agentName)))
            const env = agentInfo.getEnvironment()
            // console.log("agentInfo: ", agentInfo)
            // console.log("subsystems: ", agentInfo.data.subsystem)
            // console.log("endpoint: ", endpoint)
            const monitor = agentInfo.getMonitorByEndpoint("/" + endpoint)
            // console.log("monitor: ", monitor)
            if (!monitor) {
                logger.debug({ from: agent, agentName, endpoint }, "Agent not found: " + JSON.stringify({ topic, message }))
                return
            }
            // const subsystem = agentInfo.getSubsystem(req.params.subsystem)
            await generateEvent(
                {
                    ephemeral: monitor.data.ephemeral ?? false,
                    environment: env,
                    path: endpoint,
                    from: "agent",
                    user: agentName,
                    payload: {
                        message: parsedMessage,
                        agentName,
                        endpoint
                    }
                },
                getServiceToken()
            );
        }
    }

    topicSub(mqtts['dev'], 'agents/#', (message, topic) => processMessage('dev', message, topic))
    topicSub(mqtts['prod'], 'agents/#', (message, topic) => processMessage('prod', message, topic))
}