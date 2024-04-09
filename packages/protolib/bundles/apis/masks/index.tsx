import ApiResponse from './ApiResponse';
import ApiMask from './ApiMask';
import Fetch from './Fetch'
import Logger from './Logger';
import Automation from './Automation';
import DeviceAction from './DeviceAction';
import DeviceMonitor from './DeviceMonitor';
import SendMail from './SendMail';

const apiMasks = [
    Automation,
    ApiMask,
    Fetch,
    Logger,
    ApiResponse,
    DeviceAction,
    DeviceMonitor,
    SendMail
]

export default apiMasks;