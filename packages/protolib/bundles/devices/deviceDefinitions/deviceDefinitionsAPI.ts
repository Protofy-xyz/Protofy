import { DeviceDefinitionModel } from ".";
import { AutoAPI } from '../../../api'
import { API } from '../../../base'
import { DevicesModel } from "../devices";

const initialData = {}

const onAfterCreate = async (data, session?, req?) => {
    if (data.device && session) {
        const objectDevice = DevicesModel.load({
            name: data.name + "1",
            currentSdk: data.sdk,
            deviceDefinition: data.name,
            environment: data.environment,
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
    prefix: '/adminapi/v1/',
    transformers: {
        getConfig: async (field, e, data) => {
            //get config from deviceBoard
            const deviceBoard = await API.get("/adminapi/v1/deviceboards/" +encodeURI(data.board))
            data.config.sdkConfig = deviceBoard.data.config[data.sdk]
            return data
        }
    },
    useDatabaseEnvironment: false,
    useEventEnvironment: false
})