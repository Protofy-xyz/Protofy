import { ArduinosModel } from './arduinosSchemas';
import { AutoAPI, handler, getServiceToken, getDeviceToken } from 'protonode'


export const ArduinosAutoAPI = AutoAPI({
    modelName: 'arduinos',
    modelType: ArduinosModel,
    prefix: '/api/core/v1/',
    skipDatabaseIndexes: true
})