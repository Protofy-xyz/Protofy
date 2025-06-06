import actions from '@bundles/actions/context'
import { automation, fetch, automationResponse, executeAutomation, getServiceToken, serviceToken } from '@bundles/apis/context/'
import chatGPT from '@bundles/chatgpt/context'

export default {
    actions,
    automation,
    fetch,
    automationResponse,
    executeAutomation,
    getServiceToken,
    serviceToken,
    chatGPT
}