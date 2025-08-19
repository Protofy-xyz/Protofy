import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { getRoot } from 'protonode'
import { acquireLock, releaseLock } from './lock';
import { getLogger } from 'protobase';
import { t } from 'tar';

const logger = getLogger()

export const BoardsDir = (root) => fspath.join(root, "/data/boards/")
export const getBoards = async () => {
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

export const getBoard = async (boardId) => {
    const filePath = BoardsDir(getRoot()) + boardId + ".json";
    let fileContent = null;

    await acquireLock(filePath);
    try {
        fileContent = await fs.readFile(filePath, 'utf8');
    } catch (error) {
        throw new Error("Error reading board file: " + filePath);
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
        throw new Error("Error parsing board file: " + filePath);
    }

    return fileContent;
}

export const cleanObsoleteCardFiles = (boardId, newCardNames, req) => {
    const boardFolder = BoardsDir(getRoot(req)) + boardId + '/';
    if (!fsSync.existsSync(boardFolder)) return;

    const files = fsSync.readdirSync(boardFolder);

    const validFileNames = new Set();

    for (const name of newCardNames) {
        validFileNames.add(name + '.js');
        validFileNames.add(name + '_view.js');
    }

    for (const file of files) {
        if ((file.endsWith('.js') || file.endsWith('_view.js')) && !validFileNames.has(file)) {
            fsSync.unlinkSync(boardFolder + file);
        }
    }
};