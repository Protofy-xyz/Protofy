import { ResourceModel } from "./";
import {CreateApi, hash} from '../../api'

export const ResourcesAPI = CreateApi('resources', ResourceModel, __dirname, '/adminapi/v1/', 'resources', {})