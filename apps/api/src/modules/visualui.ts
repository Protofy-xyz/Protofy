import { app } from '../lib/app';
import * as fs from 'fs';
import { listFilesRecursively, filterFilesByRegex } from '../lib/files';

const PROJECT_WORKSPACE_DIR = "../"; // Define where the workspace root dir is

app.post('/api/v1/visualui/pages/list', async (req, res) => {
    const name = req.body.filename;
    const includeConditions = req.body.include?.map(regexText => new RegExp(regexText)) ?? []
    const dir = PROJECT_WORKSPACE_DIR + name;
    const isRecursive = req.body.recursive ?? false;
    // Example regular expressions: ["index.tsx$"]
    let filesList;
    try {
        if (isRecursive) { // returns traverse of files inside dir
            filesList = listFilesRecursively(dir).map((f) => f.split(PROJECT_WORKSPACE_DIR)[1])
        } else {
            filesList = fs.readdirSync(dir)
                .filter(name => !fs.statSync(`${dir}/${name}`)?.isDirectory())// Filter elements that are not files
                .map(f => `${name}/${f}`) // return full route
        }
        const filteredFiles = filterFilesByRegex(filesList, includeConditions);
        res.send(filteredFiles)
    } catch (e) {
        res.status(501).send(`The path '${name}' is not a directory`)
    }
});

app.post('/api/v1/visualui/pages/read', async (req, res) => {
    const name = req.body.filename
    const filename = PROJECT_WORKSPACE_DIR + name;
    try {
        const content = fs.readFileSync(filename, 'utf-8');
        res.send({content: content.toString()})
    } catch (e) {
        res.status(501).send(`Can not read file: '${name}'`)
    }
});

app.post('/api/v1/visualui/pages/write', async (req, res) => {
    const name = req.body.filename;
    const newContent = req.body.content;
    const filename = PROJECT_WORKSPACE_DIR + name;
    try {
        fs.writeFileSync(filename, newContent, 'utf-8');
        const content = fs.readFileSync(filename, 'utf-8');
        res.send({content})
    } catch (e) {
        res.status(501).send(`Can not write file: '${name}'`)
    }
});

app.post('/api/v1/visualui/pages/delete', async (req, res) => {
    const name = req.body.filename;
    const filename = PROJECT_WORKSPACE_DIR + name;
    try {
        fs.unlinkSync(filename);
        res.send({data: "Successfully deleted file"})
    } catch (e) {
        res.status(501).send(`Can not delete file: '${name}'`)
    }
});