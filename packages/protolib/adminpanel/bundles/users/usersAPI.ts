import { UserModel } from "./";
import {CreateApi} from '../../../api'

export const UsersAPI = CreateApi('accounts', UserModel, __dirname, '/adminapi/v1/', 'auth', {
    cypher: (field, e, data) => {
        console.log('executing transformer: ', field, e, data)
        return {
            ...data,
            [field]: Math.random()
        }
    }
})