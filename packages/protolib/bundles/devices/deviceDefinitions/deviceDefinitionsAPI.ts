import { DeviceDefinitionModel } from ".";
import { AutoAPI } from '../../../api'
import { API } from 'protolib/base'
import { DevicesModel } from "../devices";

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

const onAfterCreate = async (data, session?, req?) => {
    if (data.device && session) {
        const objectDevice = DevicesModel.load({
            name: data.name + "1",
            currentSdk: data.sdk,
            deviceDefinition: data.name
        })
        await API.post("/adminapi/v1/devices?token=" + session.token, objectDevice.create().getData())
    }
}


export const DeviceDefinitionsAPI = AutoAPI({
    modelName: 'devicedefinitions',
    modelType: DeviceDefinitionModel,
    initialData,
    onAfterCreate: onAfterCreate,
    skipDatabaseIndexes: true,
    prefix: '/adminapi/v1/'
})