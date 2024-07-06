import { z, Schema, AutoModel, ProtoModel, SessionDataType} from "protobase";
import moment from "moment";

export const UserSchema = Schema.object({
    username: z.string().email().label('email').hint('user@example.com').static().id().search(),
    type: z.string().min(1).label("group").hint('user, admin, ...').search().generate('user').help("The type refers to a group name. Groups contains privileges (admin true/false) and workspaces.").indexed(),
    password: z.string().min(6).hint('**********').secret().hidden(["sheet", "list", "preview"]).onCreate('cypher').onUpdate('update').onRead('clearPassword').onList('clearPassword').help("Salted hashed password using bcrypt."),
    permissions: z.array(z.string()).optional().label("additional permissions"),
    createdAt: z.string().min(1).generate((obj) => moment().toISOString()).search().hidden(["edit", "add"]).indexed(),
    lastLogin: z.string().optional().search().hidden(["edit", "add"]).indexed(),
    environments: z.array(z.enum(['dev', 'prod', '*'])).optional().help("The environments the user has access to. '*' means all environments").groupIndex("env", "return !data.environments || data.environments.includes('*') ? ['dev', 'prod'] : data.environments"),
    from: z.string().min(1).search().generate((obj) => 'admin').help("Interface used to create the user. Users can be created from command line or from the admin panel").hidden(["edit", "add"])
})
export type UserType = z.infer<typeof UserSchema>;
export class UserModel extends ProtoModel<UserModel> {
    constructor(data: UserType, session?: SessionDataType) {
        super(data, UserSchema, session, "User");
    }

    hasEnvironment(env: string) {
        return !this.data.environments || this.data.environments.includes('*') || this.data.environments.includes(env)
    }

    static load(data: any, session?: SessionDataType): UserModel {
        return this._newInstance(data, session);
    }

    list(search?, session?, extraData?, params?): any {
        if(params && params.filter && params.filter.environments) {
            const {environments, ...filter} = params.filter
            if(!this.hasEnvironment(environments)) { 
                return
            }
            params = {
                ...params,
                filter: {
                    ...filter,
                }
            }
        }
        
        //pass params with params.filter.environments removed

        return super.list(search, session, extraData, params)
    }

    protected static _newInstance(data: any, session?: SessionDataType): UserModel {
        return new UserModel(data, session);
    }
}
