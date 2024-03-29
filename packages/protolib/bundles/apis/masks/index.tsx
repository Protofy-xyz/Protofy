import DevicePub from './DevicePub';
import DeviceSub from './DeviceSub';
import ApiResponse from './ApiResponse';
import ApiMask from './ApiMask';
import Fetch from './Fetch'
import Logger from './Logger';
import Automation from './Automation';
import { filterCallback, restoreCallback } from 'protoflow';

const apiMasks = [
    Automation,
    ApiMask,
    Fetch,
    Logger,
    ApiResponse,
    DevicePub,
    DeviceSub
]

export default apiMasks;