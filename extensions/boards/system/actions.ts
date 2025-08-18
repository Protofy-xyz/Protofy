import { getBoard } from "./boards";
import { getServiceToken, requireAdmin } from "protonode";
import { API, generateEvent } from "protobase";
import { dbProvider, getDBOptions } from 'protonode';
import { getExecuteAction } from "./getExecuteAction";

const getBoardActions = async (boardId) => {
    const board = await getBoard(boardId);
    if (!board.cards || !Array.isArray(board.cards)) {
        return [];
    }
    return board.cards.filter(c => c.type === 'action');
}
const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
const token = getServiceToken()

export const getActions = async (context) => {
    const actions = await context.state.getStateTree({ chunk: 'actions' });
    const flatActions = []
    const flatten = (obj, path) => {
        if (obj.url) {
            flatActions.push({ ...obj, path: path })
        } else {
            for (const key in obj) {
                flatten(obj[key], path + '/' + key)
            }
        }
    }
    flatten(actions, '')
    return flatActions
}

const castValueToType = (value, type) => {
    switch (type) {
        case 'string':
            return String(value);
        case 'number':
            return Number(value);
        case 'boolean':
            return value === 'true' || value === true;
        case 'json':
            try {
                return JSON.parse(value);
            } catch (e) {
                return {};
            }
        case 'array':
            try {
                return JSON.parse(value);
            } catch (e) {
                return [];
            }
        case 'card':
            return value; // Assuming card is a string identifier
        case 'text':
            return value; // Assuming markdown is a string
        default:
            return value; // Default case, return as is
    }
}

export const handleBoardAction = async (context, Manager, boardId, action_or_card_id, res, params) => {
    const actions = await getBoardActions(boardId);
    const action = actions.find(a => a.name === action_or_card_id);

    if (!action) {
        res.send({ error: "Action not found" });
        return;
    }

    if (!action.rulesCode) {
        res.send({ error: "No code found for action" });
        return;
    }


    //cast params to each param type
    for (const param in params) {
        if (action.configParams && action.configParams[param]) {
            const type = action.configParams[param]?.type;
            if (type) {
                params[param] = castValueToType(params[param], type);
            }
        }
    }

    await generateEvent({
        path: `actions/boards/${boardId}/${action_or_card_id}/run`,
        from: 'system',
        user: 'system',
        ephemeral: true,
        payload: {
            status: 'running',
            action: action_or_card_id,
            boardId: boardId,
            params
        },
    }, getServiceToken());

    const states = await context.state.getStateTree();
    let rulesCode = action.rulesCode.trim();

    const wrapper = new AsyncFunction('boardName', 'name', 'states', 'boardActions', 'board', 'userParams', 'params', 'token', 'API', `
        ${getExecuteAction(await getActions(context), boardId)}
        ${rulesCode}
    `);

    try {
        let response = null;
        try {
            response = await wrapper(boardId, action_or_card_id, states, actions, states?.boards?.[boardId] ?? {}, params, params, token, API);
        } catch (err) {
            await generateEvent({
                path: `actions/boards/${boardId}/${action_or_card_id}/code/error`,
                from: 'system',
                user: 'system',
                ephemeral: true,
                payload: {
                    status: 'code_error',
                    action: action_or_card_id,
                    boardId: boardId,
                    params,
                    stack: err.stack,
                    message: err.message,
                    name: err.name,
                    code: err.code
                },
            }, getServiceToken());

            console.error("Error executing action code: ", err);
            res.status(500).send({ _err: "e_code", error: "Error executing action code", message: err.message, stack: err.stack, name: err.name, code: err.code });
            return;
        }

        if (action.responseKey && response && typeof response === 'object' && action.responseKey in response) {
            response = response[action.responseKey];
        }

        const prevValue = await context.state.get({ group: 'boards', tag: boardId, name: action.name });
        if (JSON.stringify(response) !== JSON.stringify(prevValue)) {
            await context.state.set({ group: 'boards', tag: boardId, name: action.name, value: response, emitEvent: true });
            Manager.update(`../../data/boards/${boardId}.js`, 'states', action.name, response);
        }

        res.json(response);

        await generateEvent({
            path: `actions/boards/${boardId}/${action_or_card_id}/done`,
            from: 'system',
            user: 'system',
            ephemeral: true,
            payload: {
                status: 'done',
                action: action_or_card_id,
                boardId: boardId,
                params,
                response
            },
        }, getServiceToken());

        // if persistValue is true
        if (action.persistValue) {
            const db = dbProvider.getDB('board_' + boardId);
            await db.put(action.name, response === undefined ? '' : JSON.stringify(response, null, 4));
        }
    } catch (err) {
        await generateEvent({
            path: `actions/boards/${boardId}/${action_or_card_id}/error`,
            from: 'system',
            user: 'system',
            ephemeral: true,
            payload: {
                status: 'error',
                action: action_or_card_id,
                boardId: boardId,
                params,
                stack: err.stack,
                message: err.message,
                name: err.name,
                code: err.code
            },
        }, getServiceToken());
        console.error("Error executing action: ", err);
        res.status(500).send({ _err: "e_general", error: "Error executing action", message: err.message, stack: err.stack, name: err.name, code: err.code });
    }
};