import { z } from "zod";
import {BaseSchema} from 'protolib/base'
import { AutoModel, Schema } from 'protolib/base'

export const WorkspaceResourceSchema = z.object({
    type: z.string(),
    options: z.any()
})

export const WorkspaceDataSchema = z.object({
    resources: z.array(WorkspaceResourceSchema),
    menu: z.any()
});

export type WorkspaceData = z.infer<typeof WorkspaceDataSchema>;
export type WorkspaceResourceData = z.infer<typeof WorkspaceResourceSchema>;

export const WorkspaceSchema = Schema.object({
    name: z.string().search().id().display()
}) 

export type WorkspaceType = z.infer<typeof WorkspaceSchema>;
export const WorkspaceModel = AutoModel.createDerived<WorkspaceType>("WorkspaceModel", WorkspaceSchema);

export class WorkspaceResourceModel {
    data: WorkspaceResourceData
    constructor(data: WorkspaceResourceData) {
        WorkspaceResourceSchema.parse(data)
        this.data = data
    }

    getOption(option: string, defaultValue?) {
        if (!this.data.options) return defaultValue
        return this.data.options[option]
    }

    getData() {
        return this.data
    }

    getType() {
        return this.data.type
    }
}

export class WorkspaceResourceModelCollection {
    resources: WorkspaceResourceModel[]

    constructor(resources: WorkspaceResourceModel[]) {
        this.resources = resources
    }

    byType(type: string) {
        return new WorkspaceResourceModelCollection(this.resources.filter(resource => resource.getType() === type))
    }

    byPath(path: string) {
        return new WorkspaceResourceModelCollection(this.resources.filter(resource => {
            const paths = resource.getOption('paths')
            if (!paths || !paths.length) return false
            return paths.includes(path.startsWith('/') ? path : '/' + path)
        }))
    }

    getData() {
        return this.resources.map(resource => resource.getData())
    }

    map(fn: (value: WorkspaceResourceModel, index: number, array: WorkspaceResourceModel[]) => unknown) {
        return this.resources.map(fn)
    }

    forEach(fn: (value: WorkspaceResourceModel, index: number, array: WorkspaceResourceModel[]) => void) {
        return this.resources.forEach(fn)
    }
}

export class WorkspaceParserModel {
    data: WorkspaceData
    resources: WorkspaceResourceModelCollection

    constructor(data: WorkspaceData) {
        WorkspaceDataSchema.parse(data)
        this.data = data
        this.resources = new WorkspaceResourceModelCollection(data.resources.map(resource => {
            return new WorkspaceResourceModel(resource)
        }))
    }

    getData() {
        return this.data
    }


    static load(data: WorkspaceData) {
        return new WorkspaceParserModel(data)
    }


    parse(dbs, fs) {
        const parsedWorkspaceMenu: any = {}
        Object.keys(this.data.menu).forEach((key) => {
            parsedWorkspaceMenu[key] = []
            if (this.data.menu[key].length === undefined) {
                parsedWorkspaceMenu[key] = {
                    ...this.data.menu[key], 
                    href: this.getHref(this.data.menu[key])
                }
            } else {
                this.data.menu[key].forEach((p: any) => {
                    if (p.name == '*' && p.type == 'database') {
                        dbs.forEach((db: any) => {
                            parsedWorkspaceMenu[key].push({
                                ...p,
                                name: db.name,
                                type: "database",
                                href: ('/admin/database/' + db.name).replace(/\/+/g, '/')
                            })
                        })
                    } else if (p.name == '*' && p.type == 'files') {
                        const myFiles = fs.readdirSync('../../' + p.path) //TODO: change for an async function
                        myFiles.forEach((file: any) => {
                            parsedWorkspaceMenu[key].push({
                                ...p,
                                name: p.options?.skipExtension ? file.split('.').slice(0, -1).join('.') : file,
                                type: "files",
                                href: ('/admin/files/' + p.path + '?file=' + file + '&full=1').replace(/\/+/g, '/')
                            })
                        })
                    } else {
                        const options: any = {}
                        if (p.options?.templates) {
                            options.options = { templates: p.options.templates.map(t => JSON.parse(fs.readFileSync('../../data/templates/' + t + '/' + t + '.json').toString())) }
                        }
                        parsedWorkspaceMenu[key].push({
                            ...p,
                            ...options,
                            href: this.getHref(p)
                        })
                    }
                })
            }
        })

        return new WorkspaceParserModel({
            ...this.data,
            menu: parsedWorkspaceMenu,
            resources: this.data.resources.map(resource => {
                return {
                    ...resource,
                    options: {
                        ...resource.options,
                        ...(resource.options.templates ? { templates: resource.options.templates.map(t => JSON.parse(fs.readFileSync('../../data/templates/' + t + '/' + t + '.json').toString())) } : {}),
                    }
                }
            })
        })
    }
    getHref(p: any) {
        return ('/admin/' + p.type + '/' + p.path).replace(/\/+/g, '/')
    }


    getResources() {
        return this.resources
    }
}