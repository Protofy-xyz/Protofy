import { getRoot } from 'protonode'
import { getLogger } from 'protobase'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import * as fsSync from 'fs';

const SequencesDir = (root) => fspath.join(root, "/data/sequences/")

const writeLocks = new Map();
const logger = getLogger()

async function acquireLock(filePath) {
    while (writeLocks.has(filePath)) {
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    writeLocks.set(filePath, true);
}

function releaseLock(filePath) {
    writeLocks.delete(filePath);
}


const flattenFilterKey = (filters) => Object.entries(filters).length ?
    Object.entries(filters)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => {
            const val: any = typeof value === "object" ? encodeURIComponent(JSON.stringify(value)) : value;
            return `${key}~${val}`;
        })
        .join("__") : undefined

const checkSequence = async (sequenceName) => {
    try {
        await fs.access(SequencesDir(getRoot()), fs.constants.F_OK)
    } catch (error) {
        console.log("Creating sequence folder")
        await fs.mkdir(SequencesDir(getRoot()))
    }
    try {
        await fs.access(SequencesDir(getRoot()) + `${sequenceName}/`, fs.constants.F_OK)
    } catch (error) {
        console.log("Creating sequence " + sequenceName + "folder")
        await fs.mkdir(SequencesDir(getRoot()) + `${sequenceName}/`)
    }
}

const getClosestMatchingKey = async (sequenceName, sequenceKey) => {
    const sequenceFiles = (await fs.readdir(SequencesDir(getRoot()) + `${sequenceName}/`)).filter(f => {
        const filenameSegments = f.split('.')
        return !fsSync.lstatSync(fspath.join(SequencesDir(getRoot()) + `${sequenceName}/`, f)).isDirectory() && (filenameSegments[filenameSegments.length - 1] === "json")
    }).map(f => {
        return f.split('.json')[0]
    })

    const findClosestMatchingKey = (inputKey, storedKeys) => {
        const sortedKeys = [...storedKeys].sort((a, b) => b.length - a.length);
        return sortedKeys.find(key => inputKey.startsWith(key)) || "index";
    };

    return findClosestMatchingKey(sequenceKey, sequenceFiles)
}

const getSequence = async (sequenceName, sequenceKey = "index") => {
    await checkSequence(sequenceName)

    const matchingKey = await getClosestMatchingKey(sequenceName, sequenceKey)

    const filePath = SequencesDir(getRoot()) + `${sequenceName}/${matchingKey}.json`
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

const updateSequence = async (sequenceName, data, sequenceKey = "index") => {
    await checkSequence(sequenceName)

    const filePath = SequencesDir(getRoot()) + `${sequenceName}/` + sequenceKey + ".json"

    let fileContent = null;

    await acquireLock(filePath);

    try {
        fileContent = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, fileContent, 'utf8');
    } catch (error) {
        logger.error({ error }, "Error writing board file: " + filePath);
        throw new HttpError(500, "Error writing board file");
    } finally {
        releaseLock(filePath);
    }

    return data;
}

class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "HttpError";
    }
}

export const SequencesAPI = (app, context) => {

    app.get('/api/core/v1/sequences/:sequenceId', async (req, res) => {
        const sequenceId = req.params.sequenceId
        try {
            const sequenceKey = flattenFilterKey(req.query)
            const sequence = await getSequence(sequenceId, sequenceKey)

            res.send(sequence)
        } catch (error) {
            if (error instanceof HttpError) {
                res.status(error.status).send({ error: error.message });
            } else {
                res.status(500).send({ error: "Internal Server Error" });
            }
        }
    })

    app.post('/api/core/v1/sequences/:sequenceId', async (req, res) => {
        const sequenceId = req.params.sequenceId
        const sequence = req.body
        if (!sequence) return res.status(400).send({ error: "No sequence provided" })

        const sequenceKey = flattenFilterKey(req.query)
        await updateSequence(sequenceId, sequence, sequenceKey)
        res.send(sequence)
    })
}