import { promises as fs } from 'fs';
import * as fspath from 'path';
import { CreateApi } from '../../api'
import { WorkspaceModel } from './WorkspaceModel';


const PROJECT_WORKSPACE_DIR = process.env.FILES_ROOT ?? "../../";
const workspacesDir = fspath.join(PROJECT_WORKSPACE_DIR,"/packages/app/bundles/custom/workspaces/")

const customGetDB = (path, req, session) => {
  const db = {
    async *iterator() {
        const workspaces = (await fs.readdir(workspacesDir)).filter(f => f != 'index.tsx')     
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