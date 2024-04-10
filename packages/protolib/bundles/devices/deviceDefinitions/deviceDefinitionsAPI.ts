import { DeviceDefinitionModel } from ".";
import { AutoAPI } from '../../../api'

const initialData = {
    "Empty device": {
        "id": "1",
        "name": "Empty device",
        "board": "Protofy ESP32 devBoard",
        "sdk": "esphome",
        "subsystems": {},
        "config": {
            "components": "[\n \"mydevice\",\n \"esp32dev\", \n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null\n]",
            "sdkConfig": {
                "board": "esp32dev",
                "framework": {
                    "type": "arduino"
                }
            }
        }
    }
}
export const DeviceDefinitionsAPI = AutoAPI({
    modelName: 'devicedefinitions',
    modelType: DeviceDefinitionModel,
    initialData,
    skipDatabaseIndexes: true,
    prefix: '/adminapi/v1/'
})