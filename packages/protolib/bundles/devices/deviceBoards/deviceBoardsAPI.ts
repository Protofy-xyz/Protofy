import { DeviceBoardModel } from ".";
import { AutoAPI, CreateApi } from '../../../api'

export const DeviceBoardsAPI = AutoAPI({
    modelName: 'deviceboards',
    modelType: DeviceBoardModel,
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/',
    requiresAdmin: ['*']
})