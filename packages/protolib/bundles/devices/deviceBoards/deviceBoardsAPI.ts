import { DeviceBoardModel } from ".";
import { CreateApi } from '../../../api'

export const DeviceBoardsAPI = CreateApi('deviceboards', DeviceBoardModel, __dirname, '/adminapi/v1/')