import { z } from "zod";
import {Schema} from 'protolib/base'
import moment from "moment";
import { AutoModel } from 'protolib/base'

export const GroupSchema = Schema.object({
    id: z.string().label('name').hint('user, admin, ...').static().id().search(),
    workspaces: z.array(z.string())
})
export type GroupType = z.infer<typeof GroupSchema>;
export const GroupModel = AutoModel.createDerived<GroupType>("GroupModel", GroupSchema);