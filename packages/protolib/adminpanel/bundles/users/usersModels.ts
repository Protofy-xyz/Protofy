import { UserSchema, UserType,  } from "./usersSchemas"
import { SessionDataType } from '../../../api/lib/session'
import { ProtoModel, ProtoCollection } from '../../../base'
import moment from 'moment'

export class UserModel extends ProtoModel<UserModel> {
    constructor(data: UserType, session?: SessionDataType) {
        super(data, UserSchema, session);
    }

    protected static _newInstance(data: any, session?: SessionDataType): UserModel {
        return new UserModel(data, session);
    }

    generateId(): UserModel {
        return this
    }

    setId(id: string): UserModel {
        return new (this.constructor as new (data: any, session?: SessionDataType) => UserModel)({
            ...this.data,
            username: id
        }, this.session);
    }

    // create(): UserModel {
    //     const {repassword, ...data} = this.data 
    //     return (new (this.constructor as new (data: any, session?: SessionDataType) => UserModel)({
    //         ...data,
    //         createdAt: moment().toISOString()
    //     }, this.session)).validate();
    // }

    getId() {
        return this.data.username
    }
}

export class UserCollection extends ProtoCollection<UserModel> {
    constructor(models: UserModel[]) {
        super(models)
    }
}