import { DevicesModel } from ".";
import { CreateApi } from '../../../../api'

export const DevicesAPI = CreateApi('devices', DevicesModel, __dirname, '/adminapi/v1/')