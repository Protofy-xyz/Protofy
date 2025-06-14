import { promises as fs } from 'fs';
import * as fspath from 'path';
import { AutoAPI, getRoot } from 'protonode'
import { WorkspaceModel } from './WorkspaceModel';

const workspacesDir = (root) => fspath.join(root,"/packages/app/workspaces/")

const customGetDB = (path, req, session) => {
  const db = {
    async *iterator() {
        const workspaces = (await fs.readdir(workspacesDir(getRoot(req)))).filter(f => f != 'index.tsx')     
        for (const workspace of workspaces) {
          if(workspace) yield [workspace, JSON.stringify({name:workspace.split('.')[0]})];
        }
    },

    async put(key, value) {

    },

    async *get(key) {

    }
  };

  return db;
}

export default AutoAPI({
  modelName: 'workspaces',
  modelType: WorkspaceModel,
  prefix: '/api/core/v1/',
  dbName: '',
  requiresAdmin: ['*'],
  connectDB: () => new Promise(resolve => resolve(null)),
  getDB: customGetDB,
  operations: ['list']
})
