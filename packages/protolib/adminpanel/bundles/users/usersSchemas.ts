import { z } from "zod";
import {Schema} from 'protolib/base'
import moment from "moment";
import { AutoModel } from 'protolib/base'

export const UserSchema = Schema.object({
    username: z.string().email().label('email').hint('user@example.com').static().id().search().editUI(),
    type: z.string().min(1).hint('user, admin, ...').search().editUI(),
    password: z.string().min(6).hint('**********').secret().onCreate('cypher').onUpdate('update').onRead('clearPassword').onList('clearPassword').editUI(),
    createdAt: z.string().min(1).generate((obj) => moment().toISOString()).search(),
    lastLogin: z.string().optional().search(),
    from: z.string().min(1).search()
})
export type UserType = z.infer<typeof UserSchema>;
export const UserModel = AutoModel.createDerived<UserType>("UserModel", UserSchema);