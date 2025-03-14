import { BoardModel } from "./boardsSchemas";
import { AutoAPI, getRoot } from 'protonode'
import { API, getLogger } from 'protobase'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';

const BoardsDir = (root) => fspath.join(root, "/data/boards/")

const writeLocks = new Map();
const logger = getLogger()

async function acquireLock(filePath) {
    while (writeLocks.has(filePath)) {
        await new Promise(resolve => setTimeout(resolve, 10)); // Espera 10ms antes de reintentar
    }
    writeLocks.set(filePath, true);
}

function releaseLock(filePath) {
    writeLocks.delete(filePath);
}

const getDB = (path, req, session) => {
    const db = {
        async *iterator() {
            // console.log("Iterator")
            //check if boards folder exists
            try {
                await fs.access(BoardsDir(getRoot(req)), fs.constants.F_OK)
            } catch (error) {
                console.log("Creating boards folder")
                await fs.mkdir(BoardsDir(getRoot(req)))
            }
            //list all .json files in the boards folder
            const files = (await fs.readdir(BoardsDir(getRoot(req)))).filter(f => {
                const filenameSegments = f.split('.')
                return !fsSync.lstatSync(fspath.join(BoardsDir(getRoot(req)), f)).isDirectory() && (filenameSegments[filenameSegments.length - 1] === "json")
            })
            // console.log("Files: ", files)
            for (const file of files) {
                //read file content
                await acquireLock(BoardsDir(getRoot(req)) + file);
                try {
                    const fileContent = await fs.readFile(BoardsDir(getRoot(req)) + file, 'utf8')
                    yield [file.name, fileContent];
                } catch (e) {

                } finally {
                    releaseLock(BoardsDir(getRoot(req)) + file);
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
            try {
                await fs.writeFile(filePath, JSON.stringify(value, null, 4))
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
    prefix: '/api/v1/'
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
        const states = await context.state.getStateTree();
        console.log('states: ', states);

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
            throw new HttpError(500, "Error parsing board file");
        }

        if (!fileContent.cards || !Array.isArray(fileContent.cards)) {
            return fileContent;
        }

        // Iterate over cards to get the card content
        for (let i = 0; i < fileContent.cards.length; i++) {
            const card = fileContent.cards[i];
            try {
                if (card.type === 'value') {
                    if (!card.rulesCode) {
                        logger.info({ card }, "No rulesCode for value card: " + card.key);
                        continue;
                    }
                    if (!states) {
                        logger.info({ card }, "No states, omitting value for card " + card.key);
                        continue;
                    }
                    logger.info({ card }, "Evaluating rulesCode for card: " + card.key);

                    const wrapper = new Function('states', `
                        ${card.rulesCode}
                        return reduce_state_obj(states);
                    `);

                    let value = wrapper(states);
                    logger.info({ card, value }, "New value for card " + card.key);
                    card.value = value;
                    context.state.set({ group: 'boards', tag: boardId, name: card.name, value: value });
                }
            } catch (error) {
                logger.error({ error }, "Error evaluating jsCode for card: " + card.key);
                card.value = 'error';
                card.error = error.message;
            }
        }

        return fileContent;
    };

    BoardsAutoAPI(app, context)
    app.post('/api/v1/autopilot/getValueCode', async (req, res) => {
        const prompt = await context.autopilot.getPromptFromTemplate({ templateName: "valueRules", states: JSON.stringify(req.body.states, null, 4), rules: JSON.stringify(req.body.rules, null, 4) });
        if (req.query.debug) {
            console.log("Prompt: ", prompt)
        }
        let reply = await context.lmstudio.chatWithModel(prompt, 'arcee-ai_virtuoso-small-v2')
        console.log('REPLY: ', reply)
        const jsCode = reply.choices[0].message.content
        res.send({ jsCode })
    })

    app.get('/api/v1/boards/:boardId', async (req, res) => {
        try {
            const response = await reloadBoard(req.params.boardId)
            res.send(response);
        } catch (error) {
            if (error instanceof HttpError) {
                res.status(error.status).send({ error: error.message });
            } else {
                res.status(500).send({ error: "Internal Server Error" });
            }
        }
    })


}