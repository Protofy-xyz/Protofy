import { onEvent, emitEvent } from './events/api'
import { automation, fetch, deviceAction, deviceMonitor, automationResponse, executeAutomation, getServiceToken, serviceToken } from './apis/context/'
import {createSchedule} from './automations/schedule'
import {createPeriodicSchedule} from './automations/periodicSchedule'
import { sendMailWithResend } from './resend/context'
import object from './objects/context'
import flow from './flow/context'
import flow2 from './flow/contextV2'
import os from './os/context'
import os2 from './os/context2'
import utils from './utils/context'
import keys from './keys/context'
import chatGPT from './chatgpt/context'
import logs from './logs/context'
import playwright from './playwright/context'
import automations from './automations/context'
import network from './network/context'

export default {
    onEvent,
    emitEvent,
    automation,
    automationResponse,
    getServiceToken,
    serviceToken,
    fetch,
    deviceAction,
    deviceMonitor,
    createSchedule,
    createPeriodicSchedule,
    sendMailWithResend,
    executeAutomation,
    keys,
    chatGPT,
    flow,
    flow2,
    object,
    os,
    os2,
    utils,
    logs,
    playwright,
    automations,
    network
}