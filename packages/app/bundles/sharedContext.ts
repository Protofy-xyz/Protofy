import actions from '@extensions/actions/context'
import { automation, fetch, automationResponse, executeAutomation, getServiceToken, serviceToken } from '@extensions/apis/context/'
import chatGPT from '@extensions/chatgpt/context'
import automations from '@extensions/automations/context'
import {createSchedule} from '@extensions/automations/schedule'
import {createPeriodicSchedule} from '@extensions/automations/periodicSchedule'
import autopilot from '@extensions/autopilot/context'

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
    automations,
    autopilot
}