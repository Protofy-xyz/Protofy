import { z } from "protolib/base";
import {Schema} from 'protolib/base'
import moment from "moment";
import { AutoModel } from 'protolib/base'

export const UserSchema = Schema.object({
    username: z.string().email().label('email').hint('user@example.com').static().id().search().display(),
    type: z.string().min(1).hint('user, admin, ...').search().display().help("The type refers to a group name. Groups contains privileges (admin true/false) and workspaces."),
    password: z.string().min(6).hint('**********').secret().onCreate('cypher').onUpdate('update').onRead('clearPassword').onList('clearPassword').display().help("Salted hashed password using bcrypt."),
    createdAt: z.string().min(1).generate((obj) => moment().toISOString()).search(),
    lastLogin: z.string().optional().search(),
    from: z.string().min(1).search().generate((obj) => 'admin').help("Interface used to create the user. Users can be created from command line or from the admin panel")
})
export type UserType = z.infer<typeof UserSchema>;
export const UserModel = AutoModel.createDerived<UserType>("UserModel", UserSchema);