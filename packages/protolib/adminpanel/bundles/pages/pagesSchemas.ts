import { z } from "zod";
import {BaseSchema} from 'protolib/base'
import { AutoModel, Schema } from 'protolib/base'

export const PageSchema = Schema.object({
    name: z.string().search().id().display(),
    path: z.string().search().display(),
    protected: z.boolean().display(),
    allowedTypes: z.array(z.string()).label("Allowed user types").display(),
    extraData: z.record(z.string(), z.string())
}) 

export type PageType = z.infer<typeof PageSchema>;
export const PageModel = AutoModel.createDerived<PageType>("ObjectModel", PageSchema);
