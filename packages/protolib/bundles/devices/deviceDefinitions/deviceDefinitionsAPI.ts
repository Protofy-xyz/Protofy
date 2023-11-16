import { DeviceDefinitionModel } from ".";
import { AutoAPI, CreateApi } from '../../../api'

export const DeviceDefinitionsAPI = AutoAPI({
    modelName: 'devicedefinitions',
    modelType: DeviceDefinitionModel,
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/',
    requiresAdmin: ['*']
})