import { promises as fs } from 'fs';
import * as fspath from 'path';
import { CreateApi, getRoot } from '../../api'
import { WorkspaceModel } from './WorkspaceModel';



const workspacesDir = (root) => fspath.join(root,"/packages/app/bundles/custom/workspaces/")

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

export const WorkspacesAPI = CreateApi('workspaces', WorkspaceModel, __dirname, '/adminapi/v1/', '', {}, () => { }, customGetDB, ['list'], false)
export default WorkspacesAPI