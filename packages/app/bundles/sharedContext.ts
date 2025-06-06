import actions from '@bundles/actions/context'
import { automation, fetch, automationResponse, executeAutomation, getServiceToken, serviceToken } from '@bundles/apis/context/'
import chatGPT from '@bundles/chatgpt/context'
import automations from '@bundles/automations/context'
import {createSchedule} from '@bundles/automations/schedule'
import {createPeriodicSchedule} from '@bundles/automations/periodicSchedule'

export default {
    actions,
    automation,
    fetch,
    automationResponse,
    executeAutomation,
    getServiceToken,
    serviceToken,
    chatGPT,
    createSchedule,
    createPeriodicSchedule,
    automations
}