import { UserModel } from "./";
import {CreateApi, hash} from '../../../api'

export const UsersAPI = CreateApi('accounts', UserModel, __dirname, '/adminapi/v1/', 'auth', {
    cypher: async (field, e, data) => {
        return {
            ...data,
            [field]: await hash(data[field])
        }
    }
})