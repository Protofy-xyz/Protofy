import { GroupModel } from "./";
import {CreateApi, hash} from '../../../api'

export const GroupsAPI = CreateApi('groups', GroupModel, __dirname, '/adminapi/v1/', 'auth_groups', {})