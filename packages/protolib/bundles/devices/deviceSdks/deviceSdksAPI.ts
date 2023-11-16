import { DeviceSdkModel } from ".";
import { AutoAPI, CreateApi } from '../../../api'

export const DeviceSdksAPI = AutoAPI({
    modelName: 'devicesdks',
    modelType: DeviceSdkModel,
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/',
    requiresAdmin: ['*']
})