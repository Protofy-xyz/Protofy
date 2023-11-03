import { DeviceCoreModel } from ".";
import {CreateApi} from '../../../../api'

export const DeviceCoresAPI = CreateApi('devicecores', DeviceCoreModel, __dirname, '/adminapi/v1/')