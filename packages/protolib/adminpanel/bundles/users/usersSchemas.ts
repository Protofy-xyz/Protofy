import { z } from "zod";
import {Schema} from 'protolib/base'
import moment from "moment";
import { AutoModel } from 'protolib/base'

export const UserSchema = Schema.object({
    username: z.string().email().label('email').hint('user@example.com').static().id().search(),
    type: z.string().min(1).hint('user, admin, ...').search(),
    password: z.string().min(6).hint('**********').secret().onList('cypher', 'server'),
    createdAt: z.string().min(1).hidden().generate((obj) => moment().toISOString()).search(),
    lastLogin: z.string().optional().hidden().search(),
    from: z.string().min(1).hidden().search()
})
export type UserType = z.infer<typeof UserSchema>;
export const UserModel = AutoModel.createDerived<UserType>("UserModel", UserSchema);