import { UserModel } from "./usersModels";
import {CreateApi} from '../../../api'

export const UsersAPI = CreateApi('users', UserModel, __dirname, '/adminapi/v1/', 'auth')
