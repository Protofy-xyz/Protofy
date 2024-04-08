import { DeviceSdkModel } from ".";
import { AutoAPI } from '../../../api'

const initialData = {
    "1": {   
        "id": "1",
        "name": "esphome"
    }
}
export const DeviceSdksAPI = AutoAPI({
    modelName: 'devicesdks',
    modelType: DeviceSdkModel,
    initialData,
    prefix: '/adminapi/v1/'
})