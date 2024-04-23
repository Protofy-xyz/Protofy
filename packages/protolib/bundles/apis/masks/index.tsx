import ApiResponse from './ApiResponse';
import ApiMask from './ApiMask';
import Fetch from './Fetch'
import Logger from './Logger';
import Automation from './Automation';
import DeviceAction from './DeviceAction';
import DeviceMonitor from './DeviceMonitor';
import AutomationResponse from './AutomationResponse';

const apiMasks = [
    Automation,
    ApiMask,
    Fetch,
    Logger,
    ApiResponse,
    AutomationResponse,
    DeviceAction,
    DeviceMonitor
]

export default apiMasks;