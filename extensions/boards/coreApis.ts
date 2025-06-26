import { BoardModel } from "./boardsSchemas";
import { AutoAPI, getRoot } from 'protonode'
import { API, getLogger, ProtoMemDB, set } from 'protobase'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { getServiceToken, requireAdmin } from "protonode";
import { addAction } from '@extensions/actions/coreContext/addAction';
import { removeActions } from "@extensions/actions/coreContext/removeActions";
import fileActions from "@extensions/files/fileActions";
import { addCard } from "@extensions/cards/coreContext/addCard";
import { Manager } from "./manager";

const BoardsDir = (root) => fspath.join(root, "/data/boards/")
const BOARD_REFRESH_INTERVAL = 100 //in miliseconds

const useChatGPT = true
const writeLocks = new Map();
const logger = getLogger()

const processTable = {}
const autopilotState = {}

const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

const memory = {}

export const getExecuteAction = (actions, board = '') => `
const actions = ${JSON.stringify(actions)}
async function execute_action(url, params={}) {
    console.log('Executing action: ', url, params);
    const action = actions.find(a => a.url === url);
    if (!action) {
        console.error('Action not found: ', url);
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
            if(action.configParams[param].visible === false) {
                params[param] = action.configParams[param].defaultValue
            }
        }
    }
    if (action.method === 'post') {
        let { token, ...data } = params;
        if(action.token) {
            token = action.token
        }
        //console.log('url: ', url+'?token='+token)
        const response = await API.post(url+'?token='+token, data);
        return response.data
    } else {
        const paramsStr = Object.keys(params).map(k => k + '=' + params[k]).join('&');
        //console.log('url: ', url+'?token='+token+'&'+paramsStr)
        const response = await API.get(url+'?token='+token+'&'+paramsStr);
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
                if( fsSync.existsSync(tsPath)) {
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
            const filePath = BoardsDir(getRoot(req)) + key + ".json"

            //check if the board automation file exists, if not, create it
            if (!fsSync.existsSync(BoardsDir(getRoot(req)) + key + '.js')) {
                const boardFileContent = `const { boardConnect } = require('protonode')
const { Protofy } = require('protobase')

const run = Protofy("code",
    async ({ states, board }) => {
        // board.onChange({
        //     key: 'surname',
        //     changed: (value) => {
        //         board.log('Surname changed to:', value);
        //         board.execute_action({
        //             name: 'set_age'
        //         })
        //     }
        // })
    }
)

boardConnect(run)`
                fsSync.writeFileSync(BoardsDir(getRoot(req)) + key + '.js', boardFileContent)
            }

            await acquireLock(filePath);
            removeActions({ group: 'boards', tag: key })
            try {
                await fs.writeFile(filePath, JSON.stringify(value, null, 4))
                //register actions for each card
                if (value.cards && Array.isArray(value.cards)) {
                    const actionsCards = value.cards.filter(c => c.type === 'action')
                    for (let i = 0; i < actionsCards.length; i++) {
                        const card = actionsCards[i];
                        console.log("Adding action: ", JSON.stringify(card, null, 4))
                        addAction({
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
            } catch (error) {
                console.error("Error creating file: " + filePath, error)
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
            Manager.updateActions('../../data/boards/' + board.name + '.js', actions)
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
        const states = await context.state.getStateTree();
        const fileContent = await getBoard(boardId);

        if (!fileContent.cards || !Array.isArray(fileContent.cards)) {
            return fileContent;
        }

        // Iterate over cards to get the card content
        for (let i = 0; i < fileContent.cards.length; i++) {
            const card = fileContent.cards[i];
            try {
                if (card.type === 'value') {
                    if (!card.rulesCode) {
                        // logger.info({ card }, "No rulesCode for value card: " + card.key);
                        continue;
                    }
                    if (!states) {
                        // logger.info({ card }, "No states, omitting value for card " + card.key);
                        continue;
                    }
                    // logger.info({ card }, "Evaluating rulesCode for card: " + card.key);
                    if (!memory[card.key]) {
                        memory[card.key] = {}
                    }
                    const wrapper = new AsyncFunction('states', 'data', 'memory', `
                        ${card.rulesCode}
                    `);

                    let value = await wrapper(states, card, memory[card.key]);
                    // logger.info({ value }, "Value for card " + card.key);
                    // if (value !== states && value != states['boards'][boardId][card.name]) {
                    const prevValue = await context.state.get({ group: 'boards', tag: boardId, name: card.name, defaultValue: null });

                    if (prevValue != value) {
                        // logger.info({ card, value, prevValue }, "New value for card " + card.key + ' name: ' + card.name);
                        // logger.info({ card, value }, "New value for card " + card.key);
                        // logger.info({ newValue: value, oldValue: states['boards'][boardId] }, "Setting value for card " + card.key);
                        card.value = value;
                        context.state.set({ group: 'boards', tag: boardId, name: card.name, value: value, emitEvent: true });
                        Manager.update('../../data/boards/' + boardId + '.js', states.boards[boardId] ?? {}, card.name);
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
        const prompt = await context.autopilot.getPromptFromTemplate({ templateName: "valueRules", states: JSON.stringify(req.body.states, null, 4), rules: JSON.stringify(req.body.rules, null, 4) });
        if (req.query.debug) {
            console.log("Prompt: ", prompt)
        }
        let reply = await callModel(prompt, context)
        console.log('REPLY: ', reply)
        const jsCode = reply.choices[0].message.content
        res.send({ jsCode: cleanCode(jsCode) })
    })

    app.post('/api/core/v1/autopilot/getActionCode', requireAdmin(), async (req, res) => {
        const prompt = await context.autopilot.getPromptFromTemplate({ templateName: "actionRules", states: JSON.stringify(req.body.states, null, 4), rules: JSON.stringify(req.body.rules, null, 4), actions: JSON.stringify(req.body.actions, null, 4), userParams: JSON.stringify(req.body.userParams, null, 4) });
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

    app.get('/api/core/v1/boards/:boardId/actions/:action', requireAdmin(), async (req, res) => {
        try {
            const actions = await getBoardActions(req.params.boardId);
            const action = actions.find(a => a.name === req.params.action);

            if (!action) {
                res.send({ error: "Action not found" });
                return;
            }

            if (!action.rulesCode) {
                res.send({ error: "No code found for action" });
                return;
            }

            const states = await context.state.getStateTree();
            const wrapper = new AsyncFunction('states', 'userParams', 'token', 'API', `
                ${getExecuteAction(await getActions(), req.params.boardId)}
                ${action.rulesCode}
            `);

            const response = await wrapper(states, req.query, token, API);
            //get previous value from state
            const prevValue = await context.state.get({ group: 'boards', tag: req.params.boardId, name: action.name, defaultValue: undefined });
            if (response !== prevValue) {
                //set the new value in the state
                await context.state.set({ group: 'boards', tag: req.params.boardId, name: action.name, value: response, emitEvent: true });
            }

            res.json(response);
        } catch (error) {
            logger.error({ error }, "Error executing action");
            if (error instanceof HttpError) {
                res.status(error.status).send({ error: error.message });
            } else {
                res.status(500).send({ error: error.message });
            }
        }
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

            board.autopilot = autopilotState[req.params.boardId] ?? false;
            res.send(board)
        } catch (error) {
            if (error instanceof HttpError) {
                res.status(error.status).send({ error: error.message });
            } else {
                res.status(500).send({ error: "Internal Server Error" });
            }
        }
    })

    app.get('/api/core/v1/boards/:boardId/autopilot/on', requireAdmin(), async (req, res) => {
        const boardId = req.params.boardId;

        const started = await Manager.start('../../data/boards/' + req.params.boardId + '.js', req.params.boardId, async () => {
            const states = await context.state.getStateTree();
            return states.boards && states.boards[req.params.boardId] ? states.boards[req.params.boardId] : {};
        }, async () => {
            return await context.state.get({ group: 'boards', tag: req.params.boardId, chunk: 'actions', defaultValue: {} });
        }, () => {
            autopilotState[boardId] = false;
        })

        if(started) {
            res.send({ result: 'started', message: "Board started", board: req.params.boardId });
            autopilotState[boardId] = true;
        } else {
            res.send({ result: 'already_running', message: "Board already running", board: req.params.boardId });
        }
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
        if(stopped) {
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
        group: 'autopilot',
        name: 'send',
        url: "/api/core/v1/autopilot/llm",
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
        id: 'send',
        templateName: 'Send a message to the autopilot system',
        name: 'autopilot_send',
        defaults: {
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
        id: 'send',
        templateName: 'Send a question to the board',
        name: 'board_question',
        defaults: {
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
        id: 'show',
        templateName: "Display a link in an iframe",
        name: "board_iframe",
        defaults: {
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
            name: "Image",
            icon: "image",
            description: "Display an image that scales without distortion",
            type: 'value',
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
        id: 'markdown',
        templateName: 'Display markdown text',
        name: 'board_markdown',
        defaults: {
            name: 'Markdown',
            icon: 'file-text',
            description: 'Render formatted markdown using ReactMarkdown',
            type: 'value',
            html: "return markdown(data)",
            editorOptions: {
                defaultTab: "value"
            },
        },
        emitEvent: true
    });

    addCard({
        group: 'board',
        tag: "react",
        id: 'show',
        templateName: "Display a React component",
        name: "board_react",
        defaults: {
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
        id: 'show',
        templateName: "Display an array of objects in a table",
        name: "board_table",
        defaults: {
            name: "Table",
            icon: "table-properties",
            description: "Display an array of objects in a table",
            type: 'value',
            html: "\n//data contains: data.value, data.icon and data.color\nreturn card({\n    content: cardTable(data.value), padding: '3px'\n});\n",
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
                        token: await getServiceToken()
                    })
                }
            }
        }
    }
    registerActions()
}