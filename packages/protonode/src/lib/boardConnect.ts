const protobase = require('protobase')
const protonode = require('protonode')
const API = protobase.API

export function boardConnect(run) {
    let context = {} as {
        actions: any;
        states: any;
        boardId: string;
    }
    let log = null

    const token = protonode.getServiceToken()
    const listeners = {}

    const onChange = ({ key, changed }) => {
        if (!listeners[key]) {
            listeners[key] = [];
        }
        listeners[key].push(changed);
    }

    async function execute_action({ name, params = {} }) {
        console.log('Executing action: ', name, params);
        const action = context.actions[name]
        if (!action) {
            console.error('Action not found: ', name);
            return;
        }
        const url = action.url


        console.log('Action: ', action)

        if (action.receiveBoard) {
            params['board'] = context.boardId;
        }
        //check if the action has configParams and if it does, check if the param is visible
        //if the param is not visible, hardcode the param value to the value in the configParams defaultValue
        if (action.configParams) {
            for (const param in action.configParams) {
                if(action.configParams[param].visible === false && action.configParams[param].defaultValue !== '') {
                    params[param] = action.configParams[param].defaultValue
                }
            }
        }
        if (action.method === 'post') {
            //@ts-ignore
            let { token, ...data } = params;
            if (action.token) {
                token = action.token
            }
            //console.log('url: ', url+'?token='+token)
            const response = await API.post(url + '?token=' + token, data);
            return response.data
        } else {
            const paramsStr = Object.keys(params).map(k => k + '=' + params[k]).join('&');
            //console.log('url: ', url+'?token='+token+'&'+paramsStr)
            const response = await API.get(url + '?token=' + token + '&' + paramsStr);
            return response.data
        }
    }

    process.on('message', (msg: any) => {
        if (msg.type === 'init') {
            context = msg.context;
            // console.log('[WORKER] Set state:', msg.states, 'and actions:', msg.actions, 'for board:', msg.boardId);
            log = console.log.bind(console, 'Board log [' + context.boardId + ']: ');
            if (msg.type === 'init') {
                try {
                    run({ ...context, board: { onChange, execute_action, log, id: context.boardId } });
                } catch (error) {
                    console.error('Error running board [' + context.boardId + ']:', error);
                }
            }
        } else if (msg.type === 'update') {
            console.log(`[WORKER] Update received for chunk: ${msg.chunk}, key: ${msg.key}, value: ${msg.value}`);
            console.log()
            //msg.key is the key to update, msg.value is the new value
            const chunk = msg.chunk
            const key = msg.key
            const value = msg.value
            if (key) {
                context[chunk][key] = value;
                if (chunk == 'states' && listeners[key]) {
                    listeners[key].forEach(callback => callback(context.states[key]));
                }
            } else {
                context[chunk] = value;
            }
        }
    });
}