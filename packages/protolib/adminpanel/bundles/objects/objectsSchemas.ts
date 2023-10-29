import { z } from "zod";
import {BaseSchema} from 'protolib/base'
import { AutoModel } from 'protolib/base'

export const BaseObjectSchema = z.object({
    id: z.string().search().id().display(),
    name: z.string().search().display(),
    keys: z.record(z.string(), z.object({
        type: z.union([
            z.literal("string"),
            z.literal("number"),
            z.literal("boolean"),
            z.literal("array"),
            z.literal("object"),
            z.literal("record"),
            z.literal("union")
        ]),
        modifiers: z.array(z.object({
            name: z.union([
                z.literal("id"),
                z.literal("search"),
                z.literal("generate"),
                z.literal("display"),
                z.literal("optional"),
                z.literal("email"),
                z.literal("label"),
                z.literal("hint"),
                z.literal("static"),
                z.literal("min"),
                z.literal("max"),
                z.literal("secret"),
                z.literal("onCreate"),
                z.literal("onUpdate"),
                z.literal("onRead"),
                z.literal("onDelete"),
                z.literal("onList"),
                z.literal("name")
            ])
        }))
    }).name('name')).display()
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
