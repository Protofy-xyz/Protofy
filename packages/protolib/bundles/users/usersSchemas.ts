import { z, Schema, AutoModel} from "../../base";
import moment from "moment";

export const UserSchema = Schema.object({
    username: z.string().email().label('email').hint('user@example.com').static().id().search(),
    type: z.string().min(1).label("group").hint('user, admin, ...').search().help("The type refers to a group name. Groups contains privileges (admin true/false) and workspaces."),
    password: z.string().min(6).hint('**********').secret().onCreate('cypher').onUpdate('update').onRead('clearPassword').onList('clearPassword').help("Salted hashed password using bcrypt."),
    permissions: z.array(z.string()).optional().label("additional permissions"),
    createdAt: z.string().min(1).generate((obj) => moment().toISOString()).search().hidden().indexed(),
    lastLogin: z.string().optional().search().hidden(),
    from: z.string().min(1).search().generate((obj) => 'admin').help("Interface used to create the user. Users can be created from command line or from the admin panel").hidden()
})
export type UserType = z.infer<typeof UserSchema>;
export const UserModel = AutoModel.createDerived<UserType>("UserModel", UserSchema);