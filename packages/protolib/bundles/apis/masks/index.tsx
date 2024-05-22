import ApiResponse from './ApiResponse';
import ApiResponseFile from './ApiResponseFile'
import ApiMask from './ApiMask';
import Fetch from './Fetch'
import ExecuteAutomation from './ExecuteAutomation';
import GetServiceToken from './GetServiceToken';
import Logger from './Logger';
import Automation from './Automation';
import AutomationResponse from './AutomationResponse';

const apiMasks = [
    Automation,
    ApiMask,
    Fetch,
    Logger,
    ApiResponse,
    ApiResponseFile,
    AutomationResponse,
    ExecuteAutomation,
    GetServiceToken
]

export default apiMasks;