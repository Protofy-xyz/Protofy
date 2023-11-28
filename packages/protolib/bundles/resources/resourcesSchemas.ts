import { z } from "protolib/base";
import {Schema} from 'protolib/base'
import moment from "moment";
import { ProtoModel } from 'protolib/base'
import {BaseSchema} from 'protolib/base'
import { SessionDataType } from 'protolib/api/lib/session'

export const BaseResourceSchema = Schema.object({
    name: z.string().hint("catalog, tutorial, invoice...").search().display(),
    description: z.string().display().search(),
    url: z.string().label('url').hint('http://...').static().search().display(),
    type:  z.union([
        z.literal("text"),
        z.literal("video"),
        z.literal("image"),
        z.literal("code"),
        z.literal("youtube"),
        z.literal("pdf"),
    ]).search().display(),
    tags: z.array(z.string()).search().display()

})

export const ResourceSchema = z.object({
    ...BaseSchema.shape,
    ...BaseResourceSchema.shape
});

export type ResourceType = z.infer<typeof ResourceSchema>;
export class ResourceModel extends ProtoModel<ResourceModel> {
    constructor(data: ResourceType, session?: SessionDataType) {
        super(data, ResourceSchema, session);
    }

    list(search?): any {
        if(search) {
            if(search.startsWith("tags:")){
                const tags = search.slice("tags:".length).split(",").map(tag => tag.trim().toLowerCase())
                if(tags.every(element => this.data.tags.includes(element.toLowerCase()))) {
                    return this.read();
                }

            } else {
                const searchFields = this.objectSchema.is('search').getFields()
                for(var i=0;i<searchFields.length;i++) {
                    if(((this.data[searchFields[i]]+"").toLowerCase()).includes(search.toLowerCase())) {
                        return this.read();
                    }
                }
            }
        } else {
            return this.read();
        }
    }

    protected static _newInstance(data: any, session?: SessionDataType): ResourceModel {
        return new ResourceModel(data, session);
    }
}
