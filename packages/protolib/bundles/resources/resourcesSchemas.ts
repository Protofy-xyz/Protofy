import { z } from "zod";
import {Schema} from 'protolib/base'
import moment from "moment";
import { AutoModel } from 'protolib/base'
import {BaseSchema} from 'protolib/base'

export const BaseResourceSchema = Schema.object({
    name: z.string().hint("catalog, tutorial, invoice...").search().display(),
    url: z.string().label('url').hint('http://...').static().search().display(),
    type:  z.union([
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
export const ResourceModel = AutoModel.createDerived<ResourceType>("ResourceModel", ResourceSchema);