import { z } from "zod";
import {BaseSchema} from 'protolib/base'
import { AutoModel } from 'protolib/base'

export const BaseObjectSchema = z.object({
    id: z.string().search().id().display(),
    name: z.string().search().display(),
    keys: z.array(z.object({
        name: z.string(),
        id: z.string()
    })).display()
    // data: z.string().search().display(), //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
    //from: z.string().search().display(), // system entity where the event was generated (next, api, cmd...)
    //user: z.string().generate((obj) => 'me').search(), // the original user that generates the action, 'system' if the event originated in the system itself
}) 

export const ObjectSchema = z.object({
    //...BaseSchema.shape,
    ...BaseObjectSchema.shape
});

export type ObjectType = z.infer<typeof ObjectSchema>;
export const ObjectModel = AutoModel.createDerived<ObjectType>("ObjectModel", ObjectSchema);
