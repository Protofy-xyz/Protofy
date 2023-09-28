import { WorkspaceData, WorkspaceSchema } from "../schema";

export class WorkspaceModel {
    static parse(workspace: WorkspaceData, dbs:any, fs:any) {
        WorkspaceSchema.parse(workspace) //validate
        //fill workspace
        const parsedWorkspaceMenu:any = {}
        Object.keys(workspace.menu).forEach((key) => {
            parsedWorkspaceMenu[key] = []
            workspace.menu[key].forEach((p:any) => {
                if(p.name == '*' && p.type == 'database') {
                    dbs.forEach((db:any) => {
                        parsedWorkspaceMenu[key].push({
                        ...p,
                        name: db.name, 
                        type: "database",
                        href: ('/admin/dbs/' + db.name).replace(/\/+/g, '/')
                        })
                    })
                    } else if(p.name == '*' && p.type == 'files') {
                    const myFiles = fs.readdirSync('../../'+p.path) //TODO: change for an async function
                    myFiles.forEach((file:any) => {
                        parsedWorkspaceMenu[key].push({
                        ...p,
                        name: p.options?.skipExtension?file.split('.').slice(0, -1).join('.'):file, 
                        type: "files",
                        href: ('/admin/files/' + p.path + '?file='+file+'&full=1').replace(/\/+/g, '/')
                        })
                    })
                    } else {
                    const options:any = {}
                    if(p.options?.templates) {
                        options.options = {templates: p.options.templates.map(t => JSON.parse(fs.readFileSync('../../data/templates/'+t+'/'+t+'.json').toString()))}
                    }
                    parsedWorkspaceMenu[key].push({
                        ...p,
                        ...options,
                        href: ('/admin/'+p.type+'/'+p.path).replace(/\/+/g, '/')
                    })
                }
            })
        })
        return {
            ...workspace,
            menu: parsedWorkspaceMenu
        }
    }
}