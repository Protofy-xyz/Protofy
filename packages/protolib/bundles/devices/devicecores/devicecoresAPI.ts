import { DeviceCoreModel } from ".";
import {AutoAPI, CreateApi} from '../../../api'

export const DeviceCoresAPI = AutoAPI({
    modelName: 'devicecores',
    modelType: DeviceCoreModel,
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/'
})