import { z, Schema, AutoModel, ProtoModel, SessionDataType} from "../../base";
import moment from "moment";

export const UserSchema = Schema.object({
    username: z.string().email().label('email').hint('user@example.com').static().id().search(),
    type: z.string().min(1).label("group").hint('user, admin, ...').search().help("The type refers to a group name. Groups contains privileges (admin true/false) and workspaces."),
    password: z.string().min(6).hint('**********').secret().onCreate('cypher').onUpdate('update').onRead('clearPassword').onList('clearPassword').help("Salted hashed password using bcrypt."),
    permissions: z.array(z.string()).optional().label("additional permissions"),
    createdAt: z.string().min(1).generate((obj) => moment().toISOString()).search().hidden().indexed(),
    lastLogin: z.string().optional().search().hidden(),
    environments: z.array(z.string()).optional().help("The environments the user has access to. '*' means all environments").hidden(),
    from: z.string().min(1).search().generate((obj) => 'admin').help("Interface used to create the user. Users can be created from command line or from the admin panel").hidden()
})
export type UserType = z.infer<typeof UserSchema>;
export class UserModel extends ProtoModel<UserModel> {
    constructor(data: UserType, session?: SessionDataType) {
        super(data, UserSchema, session, "User");
    }

    list(search?, session?, extraData?, params?): any {
        if(!params.env || !this.data.environments || this.data.environments.includes('*') || this.data.environments.includes(params.env)) {
            return super.list(search, session, extraData, params)
        }
    }

    protected static _newInstance(data: any, session?: SessionDataType): UserModel {
        return new UserModel(data, session);
    }
}
