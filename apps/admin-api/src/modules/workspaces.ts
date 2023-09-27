import {app} from '../lib/app';
import { handler } from '../lib/handler';
import * as fs from 'fs';
import { getDatabases } from './databases';

app.get('/adminapi/v1/workspaces', handler(async (req, res) => {
    const dbs = await getDatabases()
    const workspace = JSON.parse((await fs.promises.readFile('../../data/workspaces/basic.json')).toString())
    //fill workspace
    const parsedWorkspace:any = {}
    Object.keys(workspace).forEach((key) => {
      parsedWorkspace[key] = []
      workspace[key].forEach((p:any) => {
        if(p.name == '*' && p.type == 'database') {
          dbs.forEach((db:any) => {
            parsedWorkspace[key].push({
              ...p,
              name: db.name, 
              type: "database",
              href: ('/admin/dbs/' + db.name).replace(/\/+/g, '/')
            })
          })
        } else if(p.name == '*' && p.type == 'files') {
          const myFiles = fs.readdirSync('../../'+p.path) //TODO: change for an async function
          myFiles.forEach((file:any) => {
            parsedWorkspace[key].push({
              ...p,
              name: p.options?.skipExtension?file.split('.').slice(0, -1).join('.'):file, 
              type: "files",
              href: ('/admin/files/' + p.path + '?file='+file+'&full=1').replace(/\/+/g, '/')
            })
          })
        } else {
          parsedWorkspace[key].push({
            ...p,
            href: ('/admin/'+p.type+'/'+p.path).replace(/\/+/g, '/')
          })
        }
      })
    })

    res.send(parsedWorkspace)
}));
