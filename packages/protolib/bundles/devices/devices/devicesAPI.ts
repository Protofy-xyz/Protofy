import { DevicesModel } from ".";
import { AutoAPI, CreateApi } from '../../../api'

export const DevicesAPI = AutoAPI({
    modelName: 'devices',
    modelType: DevicesModel,
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/'
})