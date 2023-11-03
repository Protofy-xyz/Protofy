import { z } from "zod";
import {BaseSchema} from 'protolib/base'
import { AutoModel, Schema } from 'protolib/base'

export const PageSchema = Schema.object({
    name: z.string().search().id().display(),
    route: z.string().search().display(),
    template: z.union([z.literal("blank"), z.literal("default"), z.literal("admin")]).display().generate(() => 'default'),
    protected: z.boolean().display().generate(() => false).label("Require user"),
    permissions: z.array(z.string()).optional().label("Permissions").display(),
}) 

export type PageType = z.infer<typeof PageSchema>;
export const PageModel = AutoModel.createDerived<PageType>("ObjectModel", PageSchema);
