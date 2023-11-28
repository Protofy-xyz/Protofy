import { z } from "protolib/base";
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