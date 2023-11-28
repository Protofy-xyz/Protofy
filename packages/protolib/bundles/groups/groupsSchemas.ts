import { z } from "protolib/base";
import {Schema} from 'protolib/base'
import moment from "moment";
import { AutoModel } from 'protolib/base'

export const GroupSchema = Schema.object({
    name: z.string().label('name').hint('user, admin, ...').static().id().search().display(),
    workspaces: z.array(z.string()),
    admin: z.boolean().optional().display()
})

export type GroupType = z.infer<typeof GroupSchema>;
export const GroupModel = AutoModel.createDerived<GroupType>("GroupModel", GroupSchema);