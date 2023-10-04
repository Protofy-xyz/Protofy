import { handler, app } from 'protolib/api';
import * as fs from 'fs';
import { getDatabases } from './databases';
import { WorkspaceModel } from 'protolib/models';

console.log(`API Module loaded: ${__filename.split('.')[0]}`);

app.get('/adminapi/v1/workspaces', handler(async (req, res) => {
    const dbs = await getDatabases()
    const workspaceRawData = JSON.parse((await fs.promises.readFile('../../data/workspaces/basic.json')).toString())
    const workspace = WorkspaceModel.load(workspaceRawData).parse(dbs, fs).getData()
    res.send(workspace)
}));
