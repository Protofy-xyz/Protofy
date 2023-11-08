import { DeviceSdkModel } from ".";
import { CreateApi } from '../../../api'

export const DeviceSdksAPI = CreateApi('devicesdks', DeviceSdkModel, __dirname, '/adminapi/v1/')