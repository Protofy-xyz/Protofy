import { DevicesModel } from ".";
import { AutoAPI, CreateApi } from '../../../api'
import { getLogger } from "protolib/base"
import { getBaseConfig, getConfigWithoutSecrets } from 'app/BaseConfig'
import { setConfig, getConfig } from 'protolib/base/Config';

const DevicesAutoAPI = AutoAPI({
    modelName: 'devices',
    modelType: DevicesModel,
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/'
})

const logger = getLogger()
const config = getConfig()

export const DevicesAPI = (app, context) => {
    DevicesAutoAPI(app, context)
    // const { topicPub, topicSub, mqtt } = context;


    // topicSub('adminEvent', (async (message: string, topic: string) => {
    //     logger.info({ config: getConfigWithoutSecrets(config) }, "Recieved device event")
    //     // const data = AdminEventModel.load(JSON.parse(message)).getData()
    //     // READ 'data' if needed
    // }))
}