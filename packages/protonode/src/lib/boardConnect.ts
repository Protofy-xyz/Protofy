const protobase = require('protobase')
const protonode = require('protonode')
const API = protobase.API

export function boardConnect(run) {
    let states = {}
    let actions = []
    let boardId = null
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
        const action = actions[name]
        if (!action) {
            console.error('Action not found: ', name);
            return;
        }
        const url = action.url


        console.log('Action: ', action)

        if (action.receiveBoard) {
            params['board'] = boardId;
        }
        //check if the action has configParams and if it does, check if the param is visible
        //if the param is not visible, hardcode the param value to the value in the configParams defaultValue
        if (action.configParams) {
            for (const param in action.configParams) {
                if (action.configParams[param].visible === false) {
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

    process.on('message', (msg:any) => {
        if (msg.type === 'init') {
            // console.log('[WORKER] Set state:', msg.states, 'and actions:', msg.actions, 'for board:', msg.boardId);
            states = msg.states;
            actions = msg.actions;
            boardId = msg.boardId;
            log = console.log.bind(console, 'Board log [' + boardId + ']: ');
            if (msg.type === 'init') {
                try {
                    run({ states, actions, board: { onChange, execute_action, log, id: boardId } });
                } catch (error) {
                    console.error('Error running board ['+boardId+']:', error);
                }
            }
        } else if (msg.type === 'update') {
            //msg.key is the key to update, msg.value is the new value
            states = msg.states
            if (listeners[msg.key]) {
                listeners[msg.key].forEach(callback => callback(states[msg.key]));
            }
        } else if (msg.type === 'updateActions') {
            // console.log('[WORKER] Updating actions:', msg.actions);
            //msg.actions is the new actions array
            actions = msg.actions;
            // console.log('[WORKER] Actions updated:', actions);
        }
    });
}