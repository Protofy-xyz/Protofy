import { BoardModel } from "./boardsSchemas";
import { AutoAPI, getRoot } from 'protonode'
import { API, getLogger, ProtoMemDB, set } from 'protobase'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { getServiceToken } from "protonode";
import {addAction} from '../actions/context/addAction';
import { removeActions } from "../actions/context/removeActions";

const BoardsDir = (root) => fspath.join(root, "/data/boards/")
const BOARD_REFRESH_INTERVAL = 1000 //in miliseconds

const useChatGPT = true
const writeLocks = new Map();
const logger = getLogger()

const processTable = {}
const autopilotState = {}

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
    if(useChatGPT) {
        reply = await context.chatGPT.chatGPTPrompt({
            message: prompt
          })
          reply = {
            choices: [
              {
                message: {
                  content: reply[0]
                }
              }
            ]
          }
    } else {
        reply = await context.lmstudio.chatWithModel(prompt, 'arcee-ai_virtuoso-small-v2')
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
                    const fileContent = await fs.readFile(BoardsDir(getRoot()) + file+'.json', 'utf8')
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
        },

        async put(key, value) {
            // try to create the board file in the boards folder
            // console.log("Creating board: ", JSON.stringify({key,value}))
            value = JSON.parse(value)
            const filePath = BoardsDir(getRoot(req)) + key + ".json"

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
                            url: "/api/core/v1/boards/"+key+"/actions/"+card.name,
                            tag: key,
                            description: card.description ?? "",
                            params: card.params ?? {},
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

const BoardsAutoAPI = AutoAPI({
    modelName: 'boards',
    modelType: BoardModel,
    initialData: {},
    skipDatabaseIndexes: true,
    getDB: getDB,
    prefix: '/api/core/v1/'
})

class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "HttpError";
    }
}

export const BoardsAPI = (app, context) => {
    class HttpError extends Error {
        constructor(public status: number, message: string) {
            super(message);
            this.name = "HttpError";
        }
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

                    const wrapper = new Function('states', `
                        ${card.rulesCode}
                        return reduce_state_obj(states);
                    `);

                    let value = wrapper(states);
                    // logger.info({ value }, "Value for card " + card.key);
                    // if (value !== states && value != states['boards'][boardId][card.name]) {
                        const prevValue = await context.state.get({ group: 'boards', tag: boardId, name: card.name, defaultValue: null });
                        if (prevValue !== value) {
                            // logger.info({ card, value, prevValue }, "New value for card " + card.key + ' name: ' + card.name);
                            // logger.info({ card, value }, "New value for card " + card.key);
                            // logger.info({ newValue: value, oldValue: states['boards'][boardId] }, "Setting value for card " + card.key);
                            card.value = value;
                            context.state.set({ group: 'boards', tag: boardId, name: card.name, value: value, emitEvent: true });
                        }
                    // }
                }
            } catch (error) {
                // logger.error({ error }, "Error evaluating jsCode for card: " + card.key);
                card.value = 'error';
                card.error = error.message;
            }
        }

        if(autopilotState[boardId] && fileContent.rulesCode) {
            //evalute board autopilot rules
            const wrapper = new Function('states', `
                ${fileContent.rulesCode}
                async function execute_action(url, params={}) {
                    console.log('Executing action from board: ', url, params);
                    const paramsStr = Object.keys(params).map(k => k + '=' + params[k]).join('&');
                    console.log('url: ', url+'?token='+token+'&'+paramsStr)
                    const response = await API.get(url+'?token='+token+'&'+paramsStr);
                    return response.data
                }
                return process_board(states);
            `);
            await wrapper(states);
        }

        return fileContent;
    };

    BoardsAutoAPI(app, context)
    app.post('/api/core/v1/autopilot/getValueCode', async (req, res) => {
        const prompt = await context.autopilot.getPromptFromTemplate({ templateName: "valueRules", states: JSON.stringify(req.body.states, null, 4), rules: JSON.stringify(req.body.rules, null, 4) });
        if (req.query.debug) {
            console.log("Prompt: ", prompt)
        }
        let reply = await callModel(prompt, context)
        console.log('REPLY: ', reply)
        const jsCode = reply.choices[0].message.content
        res.send({ jsCode })
    })

    /*
    async function perform_actions(states, userParams) { 
        await execute_action('/api/v1/automations/test', userParams
    )}
    */
    app.post('/api/core/v1/autopilot/getActionCode', async (req, res) => {
        const prompt = await context.autopilot.getPromptFromTemplate({ templateName: "actionRulesV2", states: JSON.stringify(req.body.states, null, 4), rules: JSON.stringify(req.body.rules, null, 4), actions: JSON.stringify(req.body.actions, null, 4),  userParams: JSON.stringify(req.body.userParams, null, 4) });
        if (req.query.debug) {
            console.log("Prompt: ", prompt)
        }
        let reply = await callModel(prompt, context)
        console.log('REPLY: ', reply)
        const jsCode = reply.choices[0].message.content
        res.send({ jsCode })
    })

    app.post('/api/core/v1/autopilot/getBoardCode', async (req, res) => {
        const prompt = await context.autopilot.getPromptFromTemplate({ templateName: "boardRules", states: JSON.stringify(req.body.states, null, 4), rules: JSON.stringify(req.body.rules, null, 4), actions: JSON.stringify(req.body.actions, null, 4) });
        if (req.query.debug) {
            console.log("Prompt: ", prompt)
        }
        let reply = await callModel(prompt, context)
        console.log('REPLY: ', reply)
        const jsCode = reply.choices[0].message.content
        res.send({ jsCode })
    })


    app.get('/api/core/v1/boards/:boardId/actions/:action', async (req, res) => {
        try {
            const board = await getBoard(req.params.boardId);
            if (!board.cards || !Array.isArray(board.cards)) {
                res.send({ error: "No actions found" });
                return;
            }

            const action = board.cards.find(a => a.name === req.params.action && a.type === 'action');
            if (!action) {
                res.send({ error: "Action not found" });
                return;
            }

            if (!action.rulesCode) {
                res.send({ error: "No code found for action" });
                return;
            }

            const states = await context.state.getStateTree();
            const wrapper = new Function('states', 'userParams', 'token', 'API', `
                ${action.rulesCode}
                async function execute_action(url, params={}) {
                    console.log('Executing action: ', url, params);
                    const paramsStr = Object.keys(params).map(k => k + '=' + params[k]).join('&');
                    console.log('url: ', url+'?token='+token+'&'+paramsStr)
                    const response = await API.get(url+'?token='+token+'&'+paramsStr);
                    return response.data
                }
                return perform_actions(states, userParams);
            `);

            const response = await wrapper(states, req.query, token, API);
            res.send({response: response});
        } catch (error) {
            logger.error({ error }, "Error executing action");
            if (error instanceof HttpError) {
                res.status(error.status).send({ error: error.message });
            } else {
                res.status(500).send({ error: error.message });
            }
        }
    })

    app.get('/api/core/v1/boards/:boardId', async (req, res) => {
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

    app.get('/api/core/v1/boards/:boardId/autopilot/on', async (req, res) => {
        const boardId = req.params.boardId;
        autopilotState[boardId] = true;
        res.send({ message: "Autopilot enabled for board: " + boardId });
    })

    app.get('/api/core/v1/boards/:boardId/autopilot/off', async (req, res) => {
        const boardId = req.params.boardId;
        autopilotState[boardId] = false;
        res.send({ message: "Autopilot disabled for board: " + boardId });
    })

    setInterval(async () => {
        const boards = await getBoards()
        // console.log("Boards: ", boards)
        for (const board of boards) {
            if(processTable[board]) {
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
}