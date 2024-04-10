import { DeviceCoreModel } from ".";
import { AutoAPI } from '../../../api'

const initialData = {
    "esp32": {
        "id": "1",
        "name": "esp32",
        "sdks": ["esphome"],
        "config": {}
    }
}

export const DeviceCoresAPI = AutoAPI({
    modelName: 'devicecores',
    modelType: DeviceCoreModel,
    initialData,
    skipDatabaseIndexes: true,
    prefix: '/adminapi/v1/'
})