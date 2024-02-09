import { z } from "protolib/base";
import { Schema } from 'protolib/base'
import { AutoModel } from 'protolib/base'

export const GroupSchema = Schema.object({
  name: z.string().label('name').hint('user, admin, ...').static().id().search(),
  workspaces: z.array(z.string()).hidden(),
  permissions: z.array(z.string()).optional(),
  admin: z.boolean().optional()
})

export type GroupType = z.infer<typeof GroupSchema>;
export const GroupModel = AutoModel.createDerived<GroupType>("GroupModel", GroupSchema);