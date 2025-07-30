import { BoardModel } from "./boardsSchemas";
import { AutoAPI, getRoot, handler } from 'protonode'
import { API, getLogger, ProtoMemDB, generateEvent } from 'protobase'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { getServiceToken, requireAdmin } from "protonode";
import { addAction } from '@extensions/actions/coreContext/addAction';
import { removeActions } from "@extensions/actions/coreContext/removeActions";
import fileActions from "@extensions/files/fileActions";
import { addCard } from "@extensions/cards/coreContext/addCard";
import { Manager } from "./manager";
import { dbProvider, getDBOptions } from 'protonode';

const BoardsDir = (root) => fspath.join(root, "/data/boards/")
const BOARD_REFRESH_INTERVAL = 100 //in miliseconds

const useChatGPT = true
const writeLocks = new Map();
const logger = getLogger()

const processTable = {}
const autopilotState = {}

const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

const memory = {}
let alreadyStarted = false

export const getExecuteAction = (actions, board = '') => `
const actions = ${JSON.stringify(actions)}
async function execute_action(url_or_name, params={}) {
    console.log('Executing action: ', url_or_name, params);
    const action = actions.find(a => a.url === url_or_name || (a.name === url_or_name && a.path == '/boards/${board}/' + a.name));
    if (!action) {
        console.error('Action not found: ', url_or_name);
        return;
    }

    console.log('Action: ', action)

    if(action.receiveBoard) {
        params.board = '${board}'
    }
    //check if the action has configParams and if it does, check if the param is visible
    //if the param is not visible, hardcode the param value to the value in the configParams defaultValue
    if(action.configParams) {
        for(const param in action.configParams) {
            if(action.configParams[param].visible === false && action.configParams[param].defaultValue != '') {
                params[param] = action.configParams[param].defaultValue
            }
        }
    }

    if (action.method === 'post') {
        let { token, ...data } = params;
        if(action.token) {
            token = action.token
        }
        //console.log('url: ', action.url+'?token='+token)
        const response = await API.post(action.url+'?token='+token, data);
        return response.data
    } else {
        const paramsStr = Object.keys(params).map(k => k + '=' + encodeURIComponent(params[k])).join('&');
        //console.log('url: ', action.url+'?token='+token+'&'+paramsStr)
        const response = await API.get(action.url+'?token='+token+'&'+paramsStr);
        return response.data
    }
}
`

const prevStates = {}

const hasStateValue = () => `
       const hasStateValue = (stateName, expectedValue, dedup=true, options={}) => {
        if(!(stateName in states)) {
            if(stateName.indexOf('-') > 0) {
                //replace all '-' with '_'
                stateName = stateName.replace(/-/g, '_')
            } else if(stateName.indexOf('_') > 0) {
                //replace all '_' with '-' 
                stateName = stateName.replace(/_/g, '-')
            }
        }
        if(!(stateName in states)) {
            return false
        }
        
        let value = states[stateName]


        if (!options.caseSensitive && typeof value === 'string' && value) {
            value = value.toLowerCase()
            expectedValue = expectedValue.toLowerCase()
        }
        
        if (!(stateName in prevStates ) || prevStates[stateName] !== value || !dedup) {
            return value === expectedValue
        }

        return false
    }
`
const hasStateValueChanged = () => `
    const hasStateValueChanged = (stateName) => {
        if(!(stateName in states)) {
            if(stateName.indexOf('-') > 0) {
                //replace all '-' with '_'
                stateName = stateName.replace(/-/g, '_')
            } else if(stateName.indexOf('_') > 0) {
                //replace all '_' with '-' 
                stateName = stateName.replace(/_/g, '-')
            }
        }

        if(!(stateName in states)) {
                return false
        }

        if (!(stateName in prevStates) || prevStates[stateName] !== states[stateName]) {
            return true
        }
        return false
    }
`

const getStateValue = () => `
    const getStateValue = (stateName) => {
        if(!(stateName in states)) {
            if(stateName.indexOf('-') > 0) {
                //replace all '-' with '_'
                stateName = stateName.replace(/-/g, '_')
            } else if(stateName.indexOf('_') > 0) {
                //replace all '_' with '-' 
                stateName = stateName.replace(/_/g, '-')
            }
        }

        if(!(stateName in states)) {
            return false
        }
        return states[stateName]
    }
`

async function acquireLock(filePath) {
    while (writeLocks.has(filePath)) {
        await new Promise(resolve => setTimeout(resolve, 10)); // Espera 10ms antes de reintentar
    }
    writeLocks.set(filePath, true);
}

function releaseLock(filePath) {
    writeLocks.delete(filePath);
}

const token = getServiceToken()

const callModel = async (prompt, context) => {
    let reply;
    if (useChatGPT) {
        reply = await context.chatgpt.chatGPTPrompt({
            message: prompt
        })

        let content = reply[0]

        if (reply.isError) {
            content = "// Error: " + reply.data.error.message
        }

        reply = {
            choices: [
                {
                    message: {
                        content
                    }
                }
            ]
        }
    } else {
        reply = await context.lmstudio.chatWithModel(prompt, 'qwen2.5-coder-32b-instruct')
    }
    return reply
}

const getBoards = async () => {
    try {
        await fs.access(BoardsDir(getRoot()), fs.constants.F_OK)
    } catch (error) {
        console.log("Creating boards folder")
        await fs.mkdir(BoardsDir(getRoot()))
    }
    //list all .json files in the boards folder
    return (await fs.readdir(BoardsDir(getRoot()))).filter(f => {
        const filenameSegments = f.split('.')
        return !fsSync.lstatSync(fspath.join(BoardsDir(getRoot()), f)).isDirectory() && (filenameSegments[filenameSegments.length - 1] === "json")
    }).map(f => {
        return f.split('.json')[0]
    })
}

const getBoard = async (boardId) => {
    const filePath = BoardsDir(getRoot()) + boardId + ".json";
    let fileContent = null;

    await acquireLock(filePath);
    try {
        fileContent = await fs.readFile(filePath, 'utf8');
    } catch (error) {
        throw new HttpError(404, "Board not found");
    } finally {
        releaseLock(filePath);
    }

    try {
        fileContent = JSON.parse(fileContent);
        //iterate over cards and add the rulesCode and html properties from the card file
        for (let i = 0; i < fileContent.cards.length; i++) {
            const card = fileContent.cards[i];

            if (!card || card.rulesCode || card.html) { //legacy card, skip
                continue;
            }
            //read the card file from the board folder
            const cardFilePath = BoardsDir(getRoot()) + boardId + '/' + card.name + '.js'
            const cardHTMLFilePath = BoardsDir(getRoot()) + boardId + '/' + card.name + '_view.js'
            if (fsSync.existsSync(cardFilePath)) {
                const cardContent = await fs.readFile(cardFilePath, 'utf8')
                card.rulesCode = cardContent
            } else {
                card.rulesCode = ''
            }
            if (fsSync.existsSync(cardHTMLFilePath)) {
                const cardHTMLContent = await fs.readFile(cardHTMLFilePath, 'utf8')
                card.html = cardHTMLContent
            } else {
                card.html = ''
            }
        }
    } catch (error) {
        logger.error({ error }, "Error parsing board file: " + filePath);
        throw new HttpError(500, "Error parsing board file");
    }

    return fileContent;
}

const getDB = (path, req, session) => {
    const db = {
        async *iterator() {
            // console.log("Iterator")
            //check if boards folder exists
            const boards = await getBoards()
            // console.log("Files: ", files)
            for (const file of boards) {
                //read file content
                await acquireLock(BoardsDir(getRoot()) + file);
                try {
                    const fileContent = await fs.readFile(BoardsDir(getRoot()) + file + '.json', 'utf8')
                    yield [file.name, fileContent];
                } catch (e) {

                } finally {
                    releaseLock(BoardsDir(getRoot()) + file);
                }
            }
        },

        async del(key, value) {
            // delete boards[key]
            // try to delete the board file from the boards folder
            console.log("Deleting board: ", JSON.stringify({ key, value }))
            const filePath = BoardsDir(getRoot(req)) + key + ".json"
            try {
                await fs.unlink(filePath)
            } catch (error) {
                console.log("Error deleting file: " + filePath)
            }

            const tsPath = BoardsDir(getRoot(req)) + key + ".js"
            try {
                if (fsSync.existsSync(tsPath)) {
                    await fs.unlink(tsPath)
                }
            } catch (error) {
                console.log("Error deleting boards automations file: " + tsPath)
            }
        },

        async put(key, value) {
            // try to create the board file in the boards folder
            // console.log("Creating board: ", JSON.stringify({key,value}))
            value = JSON.parse(value)
            value.cards = (value.cards || []).map(card => {
                const { value, ...rest } = card;
                return rest;
            })

            const filePath = BoardsDir(getRoot(req)) + key + ".json"

            //check if the board automation file exists, if not, create it
            if (!fsSync.existsSync(BoardsDir(getRoot(req)) + key + '.js')) {
                const boardFileContent = `const { boardConnect } = require('protonode')
const { Protofy } = require('protobase')

const run = Protofy("code", async ({ context, states, board }) => {

})

boardConnect(run)`
                fsSync.writeFileSync(BoardsDir(getRoot(req)) + key + '.js', boardFileContent)
            }

            //check if the board directory exists, if not, create it
            try {
                await fs.access(BoardsDir(getRoot(req)), fs.constants.F_OK)
            } catch (error) {
                console.log("Creating boards folder")
                await fs.mkdir(BoardsDir(getRoot(req)))
            }

            //check if the board directory inside boards exists, if not, create it
            try {
                await fs.access(BoardsDir(getRoot(req)) + key, fs.constants.F_OK)
            } catch (error) {
                console.log("Creating board folder: ", key)
                await fs.mkdir(BoardsDir(getRoot(req)) + key)
            }

            await acquireLock(filePath);
            removeActions({ group: 'boards', tag: key })
            try {
                //register actions for each card
                console.log('cards: ', value.cards)
                if (value.cards && Array.isArray(value.cards)) {
                    for (let i = 0; i < value.cards.length; i++) {
                        //create a file for each card, in the board folder
                        const card = value.cards[i];
                        const code = card.rulesCode
                        const html = card.html
                        const cardFilePath = BoardsDir(getRoot(req)) + key + '/' + card.name + '.js'
                        const cardHTMLFilePath = BoardsDir(getRoot(req)) + key + '/' + card.name + '_view.js'
                        if(code) {
                            await fs.writeFile(cardFilePath, code)
                        } else {
                            try { await fs.unlink(cardFilePath) } catch(e) {}
                        }
                        if(html) {
                            await fs.writeFile(cardHTMLFilePath, html ? html :'')
                        } else {
                            try { await fs.unlink(cardHTMLFilePath) } catch(e) {}
                        }

                        delete card.rulesCode
                        delete card.html
                    }
                    const actionsCards = value.cards.filter(c => c && c.type === 'action')
                    for (let i = 0; i < actionsCards.length; i++) {

                        const card = actionsCards[i];
                        console.log("Adding action: ", JSON.stringify(card, null, 4))
                        addAction({
                            method: card.method || 'get',
                            group: 'boards',
                            name: card.name,
                            url: "/api/core/v1/boards/" + key + "/actions/" + card.name,
                            tag: key,
                            description: card.description ?? "",
                            params: card.params ?? {},
                            ...(card.configParams && { configParams: card.configParams }),
                            emitEvent: i === actionsCards.length - 1
                        })
                    }
                }
                await fs.writeFile(filePath, JSON.stringify(value, null, 4))
            } catch (error) {
                console.error("Error creating file: " + filePath, error, error.stack)
            } finally {
                releaseLock(filePath);
            }
        },

        async get(key) {
            // try to get the board file from the boards folder
            // console.log("Get function: ",key)
            const filePath = BoardsDir(getRoot(req)) + key + ".json"
            await acquireLock(filePath);
            try {
                const fileContent = await fs.readFile(filePath, 'utf8')
                // console.log("fileContent: ", fileContent)
                // console.log("filePath: ", filePath)
                return fileContent
            } catch (error) {
                // console.log("Error reading file: " + filePath)
                throw new Error("File not found")
            } finally {
                releaseLock(filePath);
            }
        }
    };

    return db;
}



class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "HttpError";
    }
}

export default async (app, context) => {
    const BoardsAutoAPI = AutoAPI({
        modelName: 'boards',
        modelType: BoardModel,
        initialData: {},
        skipDatabaseIndexes: true,
        getDB: getDB,
        prefix: '/api/core/v1/',
        requiresAdmin: ['*'],
        onAfterUpdate: async (board) => {
            const actions = await context.state.get({ group: 'boards', tag: board.name, chunk: 'actions', defaultValue: {} });
            Manager.update('../../data/boards/' + board.name + '.js', 'actions', null, actions)
        }
    })
    class HttpError extends Error {
        constructor(public status: number, message: string) {
            super(message);
            this.name = "HttpError";
        }
    }

    const getActions = async () => {
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

    const reloadBoard = async (boardId) => {
        // console.log('**************Reloading board: ', boardId)
        const states = (await context.state.getStateTree()) || {};
        const fileContent = await getBoard(boardId);

        if (!fileContent.cards || !Array.isArray(fileContent.cards)) {
            return fileContent;
        }

        // Iterate over cards to get the card content
        for (let i = 0; i < fileContent.cards.length; i++) {
            const card = fileContent.cards[i];
            if (!card) {
                continue;
            }


            try {
                if (card.type == 'value') {
                    if (!card.rulesCode) {
                        // logger.info({ card }, "No rulesCode for value card: " + card.key);
                        continue;
                    }

                    // logger.info({ card }, "Evaluating rulesCode for card: " + card.key);
                    if (!memory[card.key]) {
                        memory[card.key] = {}
                    }

                    let rulesCode = card.rulesCode.trim();
                    if (rulesCode.split("\n").length == 1 && !rulesCode.startsWith('return ')) {
                        rulesCode = 'return ' + rulesCode;
                    }
                    const wrapper = new AsyncFunction('states', 'board', 'data', 'memory', `
                        ${rulesCode}
                    `);

                    let value = await wrapper(states, states?.boards?.[boardId] ?? {}, card, memory[card.key]);
                    // logger.info({ value }, "Value for card " + card.key);
                    // if (value !== states && value != states['boards'][boardId][card.name]) {
                    const prevValue = await context.state.get({ group: 'boards', tag: boardId, name: card.name, defaultValue: null });

                    if (prevValue != value) {
                        // logger.info({ card, value, prevValue }, "New value for card " + card.key + ' name: ' + card.name);
                        // logger.info({ card, value }, "New value for card " + card.key);
                        // logger.info({ newValue: value, oldValue: states['boards'][boardId] }, "Setting value for card " + card.key);
                        card.value = value;
                        context.state.set({ group: 'boards', tag: boardId, name: card.name, value: value, emitEvent: true });
                        Manager.update('../../data/boards/' + boardId + '.js', 'states', card.name, value);
                    }
                    // }
                }
            } catch (error) {
                // logger.error({ error }, "Error evaluating jsCode for card: " + card.key);
                card.value = 'error';
                card.error = error.message;
            }
        }

        return fileContent;
    };

    const cleanCode = (code) => {
        //remove ```(plus anything is not an space) from the beginning of the code
        //remove ``` from the end of the code
        let cleaned = code.replace(/^```[^\s]+/g, '').replace(/```/g, '').trim()
        //remove 'javascript' from the beginning of the code if it exists
        if (cleaned.startsWith('javascript')) {
            cleaned = cleaned.replace('javascript', '').trim()
        }
        return cleaned
    }
    BoardsAutoAPI(app, context)

    app.get('/api/core/v1/autopilot/actions', requireAdmin(), async (req, res) => {
        res.send(await getActions());
    });

    app.post('/api/core/v1/autopilot/getValueCode', requireAdmin(), async (req, res) => {
        const prompt = await context.autopilot.getPromptFromTemplate({ board: req.body.board, templateName: "valueRules", states: JSON.stringify({ boards: req.body.states }, null, 4), rules: JSON.stringify(req.body.rules, null, 4) });
        if (req.query.debug) {
            console.log("Prompt: ", prompt)
        }
        let reply = await callModel(prompt, context)
        console.log('REPLY: ', reply)
        const jsCode = reply.choices[0].message.content
        res.send({ jsCode: cleanCode(jsCode) })
    })

    app.post('/api/core/v1/autopilot/getActionCode', requireAdmin(), async (req, res) => {
        const prompt = await context.autopilot.getPromptFromTemplate({ board: req.body.board, templateName: "actionRules", states: JSON.stringify({ boards: req.body.states }, null, 4), rules: JSON.stringify(req.body.rules, null, 4), actions: JSON.stringify(req.body.actions, null, 4), userParams: JSON.stringify(req.body.userParams, null, 4) });
        if (req.query.debug) {
            console.log("Prompt: ", prompt)
        }
        let reply = await callModel(prompt, context)
        console.log('REPLY: ', reply)
        const jsCode = reply.choices[0].message.content
        res.send({ jsCode: cleanCode(jsCode) })
    })

    app.post('/api/core/v1/autopilot/getBoardCode', requireAdmin(), async (req, res) => {
        //we need to look for configParams in the action. If there is a config for the param, we need to check
        //if the param is visible. If its not visible, we should not include it in the params object
        Object.keys(req.body.actions).map(k => {
            const a = req.body.actions[k]
            if (a.configParams) {
                for (const param in a.configParams) {
                    if (a.configParams[param].visible === false) {
                        delete a.params[param]
                    }
                }
            }
        })

        const prompt = await context.autopilot.getPromptFromTemplate({ templateName: "boardRules", states: JSON.stringify(req.body.states, null, 4), rules: JSON.stringify(req.body.rules, null, 4), actions: JSON.stringify(req.body.actions, null, 4) });
        if (req.query.debug) {
            console.log("Prompt: ", prompt)
        }
        let reply = await callModel(prompt, context)
        console.log('REPLY: ', reply)
        const jsCode = reply.choices[0].message.content
        res.send({ jsCode: cleanCode(jsCode) })
    })

    const getBoardActions = async (boardId) => {
        const board = await getBoard(boardId);
        if (!board.cards || !Array.isArray(board.cards)) {
            return [];
        }
        return board.cards.filter(c => c.type === 'action');
    }

    app.get('/api/core/v1/boards/:boardId/automation', requireAdmin(), async (req, res) => {
        try {
            const boardId = req.params.boardId;
            const filePath = BoardsDir(getRoot()) + boardId + '.js';
            if (!fsSync.existsSync(filePath)) {
                res.status(404).send({ error: "Board automation file not found" });
                return;
            }
            const fileContent = await fs.readFile(filePath, 'utf8');
            res.send({ code: fileContent });
        } catch (error) {
            logger.error({ error }, "Error getting board automation");
            res.status(500).send({ error: "Internal Server Error" });
        }
    })

    app.post('/api/core/v1/boards/:boardId/automation', requireAdmin(), async (req, res) => {
        try {
            const boardId = req.params.boardId;
            const filePath = BoardsDir(getRoot()) + boardId + '.js';
            try {
                await fs.writeFile(filePath, req.body.code);
                res.send({ message: "Board automation updated successfully" });
            } catch (error) {
                logger.error({ error }, "Error writing board automation file");
                res.status(500).send({ error: "Internal Server Error" });
            } finally {
                releaseLock(filePath);
            }
        } catch (error) {
            logger.error({ error }, "Error updating board automation");
            res.status(500).send({ error: "Internal Server Error" });
        }
    })

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

    const handleBoardAction = async (boardId, action_or_card_id, res, params) => {
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
        ${getExecuteAction(await getActions(), boardId)}
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
            if(action.persistValue) {
                const db = dbProvider.getDB('board_'+boardId);
                await db.put(action.name, response === undefined? '' : JSON.stringify(response, null, 4));
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

    // Aceptar GET
    app.get('/api/core/v1/boards/:boardId/actions/:action', requireAdmin(), (req, res) => {
        handleBoardAction(req.params.boardId, req.params.action, res, req.query)
    })

    const hasAccessToken = async (tokenType, session, cardId, boardId, token) => {
        const board = await getBoard(boardId);
        if (!board.cards || !Array.isArray(board.cards)) {
            return false
        }
        const card = board.cards.find(c => c.name === cardId);
        if (!card) {
            return false;
        }

        if (card.tokens && card.tokens[tokenType]) {
            const cardToken = card.tokens[tokenType];
            if (cardToken === token || (session && session.user.admin)) {
                return true;
            }
        } else {
            if (session && session.user.admin) {
                return true;
            }
        }
        return false;
    }

    app.get('/api/core/v1/boards/:boardId/cards/:cardId', handler(async (req, res, session, next) => {
        //get read token from card
        if (!(await hasAccessToken('read', session, req.params.cardId, req.params.boardId, req.query.token))) {
            res.status(403).send({ error: "Forbidden: Invalid token" });
        } else {
            const value = ProtoMemDB('states').get('boards', req.params.boardId, req.params.cardId);
            res.send(value || null);
        }
    }))

    app.get('/api/core/v1/boards/:boardId/cards/:cardId/run', handler(async (req, res, session, next) => {
        //get read token from card
        if (!(await hasAccessToken('run', session, req.params.cardId, req.params.boardId, req.query.token))) {
            res.status(403).send({ error: "Forbidden: Invalid token" });
        } else {
            handleBoardAction(req.params.boardId, req.params.cardId, res, req.query);
        }
    }))

    // Aceptar POST
    app.post('/api/core/v1/boards/:boardId/actions/:action', requireAdmin(), (req, res) => {
        handleBoardAction(req.params.boardId, req.params.action, res, req.body)
    })

    app.get('/api/core/v1/boards/:boardId', requireAdmin(), async (req, res) => {
        try {
            const values = ProtoMemDB('states').getByTag('boards', req.params.boardId);
            const board = await getBoard(req.params.boardId);
            if (!board.cards || !Array.isArray(board.cards)) {
                res.send(board);
                return;
            }

            //iterate over values keys, find the corresponding card and set the value (card.name == key)
            for (const key in values) {
                const card = board.cards.find(c => c.name === key);
                if (card) {
                    card.value = values[key];
                }
            }
            const autopilot = autopilotState[req.params.boardId] ?? false;
            board.autopilot = autopilot
            res.send(board)
        } catch (error) {
            if (error instanceof HttpError) {
                res.status(error.status).send({ error: error.message });
            } else {
                res.status(500).send({ error: "Internal Server Error" });
            }
        }
    })

    const startAutoPilot = async (boardId, res?) => {
        const started = await Manager.start('../../data/boards/' + boardId + '.js', async () => {
            const states = await context.state.getStateTree();
            return {
                boardId: boardId,
                states: states.boards && states.boards[boardId] ? states.boards[boardId] : {},
                actions: await context.state.get({ group: 'boards', tag: boardId, chunk: 'actions', defaultValue: {} })
            }
        }, () => {
            autopilotState[boardId] = false;
        })

        if (started) {
            autopilotState[boardId] = true;
            logger.info(`Autopilot started for board: ${boardId}`);
            if(res) res.send({ result: 'started', message: "Board started", board: boardId });

        } else {
            logger.info(`Autopilot already running for board: ${boardId}`);
            if(res) res.send({ result: 'already_running', message: "Board already running", board: boardId });
        }

    }
    app.get('/api/core/v1/boards/:boardId/autopilot/on', requireAdmin(), async (req, res) => {
        const boardId = req.params.boardId;
        startAutoPilot(boardId, res);
    })

    app.get('/api/core/v1/viewLib', requireAdmin(), async (req, res) => {
        //iterate over all directories in ../../extensions and for each directory
        // check if it has a viewLib.js file
        // if it does, read the contents and concatenate them into a single string

        const extensionsPath = fspath.join(getRoot(), 'extensions')
        let viewLib = ''
        try {
            const files = await fs.readdir(extensionsPath)
            for (const file of files) {
                const filePath = fspath.join(extensionsPath, file, 'viewLib.js')
                if (fsSync.existsSync(filePath)) {
                    const fileContent = await fs.readFile(filePath, 'utf8')
                    viewLib += fileContent + '\n'
                }
            }
        } catch (error) {
            console.error("Error reading extensions folder: ", error)

            res.status(500).send({ error: "Error reading extensions folder" })
            return
        }

        res.send(viewLib)
    })

    app.get('/api/core/v1/boards/:boardId/autopilot/off', requireAdmin(), async (req, res) => {
        const boardId = req.params.boardId;
        const stopped = Manager.stop('../../data/boards/' + req.params.boardId + '.js');
        if (stopped) {
            res.send({ result: 'sopped', message: "Board stopped", board: req.params.boardId });
        } else {
            res.send({ result: 'already_stopped', message: "Board already stopped or not running", board: req.params.boardId });
        }

    })

    app.get('/api/core/v1/autopilot/llm', requireAdmin(), async (req, res) => {
        if (!req.query.prompt) {
            res.status(400).send('Missing prompt parameter')
            return
        }

        if (!req.query.board) {
            res.status(400).send('Missing board parameter')
            return
        }

        const board = (await API.get(`/api/core/v1/boards/${req.query.board}?token=${getServiceToken()}`)).data
        if (!board || !board.cards || !Array.isArray(board.cards)) {
            res.send({ error: "No actions found" });
            return;
        }
        const boardId = req.query.board

        const actions = board.cards.filter(c => c.type === 'action')
        const states = board.cards.filter(c => c.type === 'value').reduce((acc, c) => {
            acc[c.name] = c.value
            return acc
        }, {})

        const userprompt = `
            Never use the chat state in the generated code. The chat state is only to understand what code to generate, but will not be available in the runtime.
            Do not check any state if the user has not provided it in the prompt or requested to consider it.
            Most probably you just need to write a single line of code calling await execute_action. Try to keep it as simple as possible.
            The simpler the better.
            Remember to always return a value from the generated code.
        `+ req.query.prompt

        const prompt = await context.autopilot.getPromptFromTemplate({ templateName: "boardRules", rules: userprompt, states: JSON.stringify(states, null, 4), actions: JSON.stringify(actions, null, 4) });
        console.log('prompt: ', prompt)
        let reply = await callModel(prompt, context)
        if (reply?.choices[0]?.message?.content) {
            reply = cleanCode(reply.choices[0].message.content)
        }

        console.log('GENERATED CODE: ', reply)

        const wrapper = new AsyncFunction('states', 'token', 'API', 'prevStates', `
            ${getExecuteAction(await getActions())}
            ${hasStateValue()}
            ${hasStateValueChanged()}
            ${getStateValue()}
            ${reply}
        `);
        try {
            const response = await wrapper(states ?? {}, token, API, prevStates[boardId] ?? {});
            res.json(response)
        } catch (e) {
            console.error("Error executing generated code: ", e)
            res.send(`error: ${e.message}`)
        }
    })


    addAction({
        group: 'board',
        name: 'reset',
        url: "/api/core/v1/autopilot/llm",
        tag: 'card',
        description: "Resets the value of a card in the board",
        params: {
            name: "the name of the card to reset"
        },
        emitEvent: true,
        receiveBoard: true,
        token: await getServiceToken()
    })

    addCard({
        group: 'board',
        tag: 'card',
        id: 'board_reset',
        templateName: 'Reset card value',
        name: 'board_reset',
        defaults: {
            type: "action",
            icon: 'message-square-text',
            name: 'card reset',
            description: 'Reset the value of a card in the board',
            params: {
                name: "Name of the card to reset"
            },
            rulesCode: `return await execute_action("/api/core/v1/board/cardreset", userParams)`,
            displayResponse: true,
            buttonLabel: "Reset card",
            displayIcon: false
        },
        emitEvent: true,
        token: await getServiceToken()
    })

    app.get('/api/core/v1/board/cardreset', requireAdmin(), async (req, res) => {
        if (!req.query.name) {
            res.status(400).send('Missing name parameter')
            return
        }

        if (!req.query.board) {
            res.status(400).send('Missing board parameter')
            return
        }

        const board = await getBoard(req.query.board);
        if (!board.cards || !Array.isArray(board.cards)) {
            res.send({ error: "No cards found" });
            return;
        }

        const card = board.cards.find(c => c.name === req.query.name);
        if (!card) {
            res.send({ error: "Card not found" });
            return;
        }

        await context.state.set({ group: 'boards', tag: req.query.board, name: card.name, value: card.initialValue ?? undefined, emitEvent: true });

        Manager.update('../../data/boards/' + req.query.board + '.js', 'states', card.name, null);
        res.json(card.name);
    })

    addAction({
        group: 'autopilot',
        name: 'send',
        url: "/api/core/v1/board/cardreset",
        tag: 'message',
        description: "Send a direct instruction to the autopilot system, in natural language. Returns the result of executing the instruction.",
        params: {
            prompt: "the message to send"
        },
        emitEvent: true,
        receiveBoard: true,
        token: await getServiceToken()
    })

    addCard({
        group: 'autopilot',
        tag: 'message',
        id: 'autopilot_send_message',
        templateName: 'Send a message to the autopilot system',
        name: 'send',
        defaults: {
            width: 2,
            height: 8,
            type: "action",
            icon: 'message-square-text',
            name: 'autopilot_send',
            description: 'Send a direct instruction to the autopilot system, in natural language. Returns the result of executing the instruction.',
            params: {
                prompt: "Message to send to the system"
            },
            rulesCode: `return await execute_action("/api/core/v1/autopilot/llm", userParams)`,
            displayResponse: true
        },
        emitEvent: true,
        token: await getServiceToken()
    })


    app.get('/api/core/v1/board/question', requireAdmin(), async (req, res) => {
        if (!req.query.prompt) {
            res.status(400).send('Missing prompt parameter')
            return
        }

        if (!req.query.board) {
            res.status(400).send('Missing board parameter')
            return
        }

        const prompt = 'Recover and return the data necessary to answer the following question: ' + req.query.prompt
        const data = (await API.get(`/api/core/v1/autopilot/llm?prompt=${prompt}&board=${req.query.board}`)).data

        const secondPrompt = 'Given the data: ' + JSON.stringify(data, null, 4) + ' answer the following question: ' + req.query.prompt + `.
        If the question is about a value of something, infere the answer just from the data.
        If data has only one value, return that value.
        If data has multiple values, return the most likely value.
        Try to keep the responses short, just give the answer, no need to explain.
        If the user asks for the value of something, include something like "the value of... is ..." in the response, but using the language used by the user.
        `
        const reply = (await callModel(secondPrompt, context))?.choices[0]?.message?.content
        res.json(reply ?? "I don't understand, please try again")
    });

    addAction({
        group: 'board',
        name: 'send',
        url: "/api/core/v1/board/question",
        tag: 'question',
        description: "Send a question to the board in natural language and receive natural lanaguage responses",
        params: {
            prompt: "question to send"
        },
        emitEvent: true,
        receiveBoard: true
    })

    addCard({
        group: 'board',
        tag: 'question',
        id: 'board_question_send',
        templateName: 'Send a question to the board',
        name: 'board_question',
        defaults: {
            width: 2,
            height: 8,
            type: "action",
            icon: 'message-square-text',
            name: 'board question',
            description: 'Send a question to the board in natural language and receive natural lanaguage responses',
            params: {
                prompt: "question to send"
            },
            rulesCode: `return await execute_action("/api/core/v1/board/question", userParams)`,
            displayResponse: true
        },
        emitEvent: true,
    })

    addCard({
        group: 'board',
        tag: "iframe",
        id: 'board_iframe_show',
        templateName: "Display a link in an iframe",
        name: "show",
        defaults: {
            width: 4,
            height: 12,
            name: "Frame",
            icon: "monitor-stop",
            description: "Display a link in an iframe",
            type: 'value',
            html: `
// data contains: data.value, data.icon and data.color
return card({
  content: iframe({ src: \`\${data.value}\` }),
  padding: '3px'
});
`,
            editorOptions: {
                defaultTab: "value"
            },
        },
        emitEvent: true
    });

    addCard({
        group: 'board',
        tag: 'youtube',
        id: 'youtube',
        templateName: 'Display a YouTube video',
        name: 'board_youtube',
        defaults: {
            width: 3,
            height: 8,
            name: 'YouTube Video',
            icon: 'youtube',
            description: 'Embed a YouTube video from a URL',
            type: 'value',
            html: `
// data contains: data.value, data.icon and data.color
return card({
  content: youtubeEmbed({ url: \`\${data.value}\` }),
  padding: '3px'
});
`,
            editorOptions: {
                defaultTab: "value"
            },
        },
        emitEvent: true
    });


    addCard({
        group: 'board',
        tag: "image",
        id: 'image',
        templateName: "Display an image",
        name: "board_image",
        defaults: {
            width: 1,
            height: 4,
            name: "Image",
            icon: "image",
            description: "Display an image that scales without distortion",
            type: 'value',
            rulesCode: 'return `/public/vento-square.png`',
            html: `
// data contains: data.value, data.icon and data.color
return card({
  content: boardImage({ src: \`\${data.value}\` }),
  padding: '3px'
});
`,
            editorOptions: {
                defaultTab: "value"
            },
        },
        emitEvent: true
    });

    addCard({
        group: 'board',
        tag: 'markdown',
        id: 'board_markdown',
        templateName: 'Display markdown text',
        name: 'board_markdown',
        defaults: {
            width: 3,
            height: 12,
            name: 'Markdown',
            icon: 'file-text',
            description: 'Render formatted markdown using ReactMarkdown',
            type: 'value',
            html: "//@react\nreturn markdown(data)",
            rulesCode: "return `# h1 Heading 8-)\n## h2 Heading\n### h3 Heading\n#### h4 Heading\n##### h5 Heading\n###### h6 Heading\n\n## Tables\n\n| Option | Description |\n| ------ | ----------- |\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\nRight aligned columns\n\n| Option | Description |\n| ------:| -----------:|\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |`",
            editorOptions: {
                defaultTab: "value"
            },
        },
        emitEvent: true
    });

    addCard({
        group: 'board',
        tag: 'filebrowser',
        id: 'board_filebrowser',
        templateName: 'Display a file browser',
        name: 'view',
        defaults: {
            width: 5.5,
            height: 12,
            name: 'File Browser',
            icon: 'folder-search',
            description: 'Render a file browser',
            type: 'value',
            html: "return fileBrowser(data)",
            rulesCode: "return `/data/public`",
            editorOptions: {
                defaultTab: "value"
            },
        },
        emitEvent: true
    });

    addCard({
        group: 'memory',
        tag: 'object',
        id: 'memory_interactive_object',
        templateName: 'Interactive object',
        name: 'interactive',
        defaults: {
            name: 'object',
            icon: 'file-stack',
            width: 2,
            height: 12,
            description: 'Interactive object',
            type: 'action',
            editorOptions: {
                defaultTab: "value"
            },
            html: "reactCard(`\n  function Widget(props) {\n    console.log('react object widget: ', props.value)\n    return (\n      <Tinted>\n        <ViewObject\n          object={props.value}\n          onAdd={(key, value) => execute_action('${data.name}', { action: 'set', key, value })}\n          onValueEdit={(key, value) => execute_action('${data.name}', { action: 'set', key, value })}\n          onKeyDelete={(key) => execute_action('${data.name}', { action: 'delete', key })}\n          onKeyEdit={(oldKey, newKey) => execute_action('${data.name}', { action: 'rename', oldKey, newKey })}\n          onClear={() => execute_action('${data.name}', { action: 'reset' })}\n        />\n      </Tinted>\n    );\n  }\n`, data.domId, data)",
            displayResponse: true,
            rulesCode: "if (params.action === 'reset' || params.action === 'clear') {\r\n  return {};\r\n} else if (params.action === 'set') {\r\n  const key = params.key\r\n  const value = params.value\r\n  return { ...(board?.[name] ?? {}), [key]: value }\r\n} else if (params.action === 'delete') {\r\n  const newObj = { ...(board?.[name] ?? {}) }\r\n  delete newObj[params.key]\r\n  return newObj\r\n} else if (params.action === 'rename') {\r\n  const oldKey = params.oldKey\r\n  const newKey = params.newKey\r\n  const obj = { ...(board?.[name] ?? {}) }\r\n  if (oldKey !== newKey && obj[oldKey] !== undefined && obj[newKey] === undefined) {\r\n    obj[newKey] = obj[oldKey]\r\n    delete obj[oldKey]\r\n  }\r\n  return obj\r\n} else {\r\n  return board?.[name] ?? {}\r\n}",
            params: {
                key: "key",
                value: "value"
            },
            configParams: {
                key: {
                    visible: true,
                    defaultValue: ""
                },
                value: {
                    visible: true,
                    defaultValue: ""
                }
            },
            displayButton: false
        },
        emitEvent: true
    });

    addCard({
        group: 'memory',
        tag: 'queue',
        id: 'board_interactive_queue',
        templateName: 'Queue of items',
        name: 'interactive',
        defaults: {
            name: 'queue',
            icon: 'file-stack',
            width: 2,
            height: 12,
            description: 'Interactive queue of items',
            type: 'action',
            editorOptions: {
                defaultTab: "value"
            },
            html: "//@card/react\nfunction Widget(props) {\n  return (\n      <Tinted>\n          <ViewList \n            items={props.value} \n            onClear={(items) => execute_action(props.name, {action: 'clear'})}\n            onPush={(item) => execute_action(props.name, {action: 'push', item})}\n            onDeleteItem={(item, index) => execute_action(props.name, {action: 'remove', index})} \n          />\n      </Tinted>\n  );\n}\n",
            displayResponse: true,
            rulesCode: "if (params.action == 'reset') {\r\n    return [];\r\n} else if (params.action == 'pop') {\r\n    return (Array.isArray(board?.[name]) ? board?.[name] : []).slice(1);\r\n} else if (params.action == 'remove') {\r\n    const queue = Array.isArray(board?.[name]) ? board[name] : [];\r\n    const index = parseInt(params.index, 10);\r\n    return queue.slice(0, index).concat(queue.slice(index + 1));\r\n} else if(params.action == 'clear') {\r\n    return []\r\n} else {\r\n    return (Array.isArray(board?.[name]) ? board?.[name] : []).concat([params.item]);\r\n}",
            params: {
                item: "",
                action: "action to perform in the queue: push, pop, clear"
            },
            configParams: {
                item: {
                    visible: true,
                    defaultValue: ""
                },
                action: {
                    "visible": true,
                    "defaultValue": ""
                }
            },
            displayButton: false
        },
        emitEvent: true
    });

    addCard({
        group: 'board',
        tag: "react",
        id: 'board_react',
        templateName: "Display a React component",
        name: "show",
        defaults: {
            width: 2,
            height: 8,
            name: "React",
            icon: "table-properties",
            description: "Display a React component",
            type: 'value',
            html: "reactCard(`\n  function Widget() {\n    return (\n        <Tinted>\n          <View className=\"no-drag\">\n            {/* you can use data.value here to access the value */}\n            <center><Text>Hello from react</Text></center>\n          </View>\n        </Tinted>\n    );\n  }\n\n`, data.domId)\n"
        },
        emitEvent: true
    })

    addCard({
        group: 'board',
        tag: "table",
        id: 'board_table_show',
        templateName: "Display an array of objects in a table",
        name: "show",
        defaults: {
            width: 3,
            height: 10,
            name: "Table",
            icon: "table-properties",
            description: "Display an array of objects in a table",
            type: 'value',
            html: "\n//data contains: data.value, data.icon and data.color\nreturn card({\n    content: cardTable(data.value), padding: '3px'\n});\n",
            rulesCode: "return [{name: \"protofito\", age: 20}, {name: \"protofita\", age: 19}, {name: \"bad protofito\", age: 10}]",
        },
        emitEvent: true
    })

    setInterval(async () => {
        const boards = await getBoards()
        // console.log("Boards: ", boards)
        for (const board of boards) {
            if (processTable[board]) {
                console.log("Board already being processed: ", board)
                continue;
            }
            processTable[board] = true
            try {
                await reloadBoard(board)
            } catch (error) {
                console.error("Error reloading board: ", board, error)
            } finally {
                processTable[board] = false
            }
        }
    }, BOARD_REFRESH_INTERVAL)

    context.events.onEvent(
        context.mqtt,
        context,
        async (event) => {
            if(!alreadyStarted) {
                alreadyStarted = true;
                logger.info("API is ready, starting autopilot for all boards with autoplay enabled")
                const boards = await getBoards()
                for (const board of boards) {
                    const boardContent = await getBoard(board)
                    if (boardContent.settings?.autoplay) {
                        logger.info(`Autopilot enabled for board: ${board}, starting...`)
                        try {
                            await startAutoPilot(board);
                        } catch (error) {
                            logger.error(`Error starting autopilot for board: ${board}`, error);
                        }
                    }
                }
            }
        },
        "services/api/ready",
        "api"
    )

    app.get('/api/core/v1/reloadBoards', requireAdmin(), async (req, res) => {
        registerActions()
        res.send({ message: "Boards reloaded" })
    })

    const registerActions = async () => {
        //register actions for each board
        const boards = await getBoards()
        for (const board of boards) {
            const boardContent = await getBoard(board)
            if (boardContent.cards && Array.isArray(boardContent.cards)) {
                const actionsCards = boardContent.cards.filter(c => c.type === 'action')
                for (let i = 0; i < actionsCards.length; i++) {
                    const card = actionsCards[i];
                    addAction({
                        group: 'boards',
                        name: card.name,
                        url: "/api/core/v1/boards/" + board + "/actions/" + card.name,
                        tag: board,
                        description: card.description ?? "",
                        params: card.params ?? {},
                        configParams: card.configParams ?? undefined,
                        emitEvent: i === actionsCards.length - 1,
                        persistValue: card.persistValue ?? false,
                    })
                    if(card.persistValue) {
                        // if persistValue is true, save the board state
                        const db = dbProvider.getDB('board_' + board);
                        try {
                            const content = await db.get(card.name);
                            await context.state.set({ group: 'boards', tag: board, name: card.name, value: JSON.parse(content), emitEvent: true });
                        } catch (error) {
                            logger.info("No previous value in DB found for card: ", card.name);
                        }
                    }
                }
            }
        }
    }
    registerActions()
}