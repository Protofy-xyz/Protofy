import { UserSchema, UserType,  } from "./usersSchemas"
import { SessionDataType } from '../../../api/lib/session'
import { ProtoModel, ProtoCollection } from '../../../base'

export class UserModel extends ProtoModel<UserModel> {
    constructor(data: UserType, session?: SessionDataType) {
        super(data, session);
    }

    protected static _newInstance(data: any, session?: SessionDataType): UserModel {
        return new UserModel(data, session);
    }

    validate(): this {
        UserSchema.parse(this.data); //validate
        return this;
    }
}

export class UserCollection extends ProtoCollection<UserModel> {
    constructor(models: UserModel[]) {
        super(models)
    }
}