import { UserModel } from "./";
import {CreateApi} from '../../../api'

export const UsersAPI = CreateApi('accounts', UserModel, __dirname, '/adminapi/v1/', 'auth')