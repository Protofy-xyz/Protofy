import { onEvent, emitEvent } from 'protolib/bundles/events/api'
import { automation, fetch, deviceAction, deviceMonitor, automationResponse, executeAutomation, getServiceToken, serviceToken } from 'protolib/bundles/apis/context/'
import {createSchedule} from 'protolib/bundles/automations/schedule'
import {createPeriodicSchedule} from 'protolib/bundles/automations/periodicSchedule'
import { sendMailWithResend } from 'protolib/bundles/resend/context'
import object from 'protolib/bundles/objects/context'
import flow from 'protolib/bundles/flow/context'
import flow2 from 'protolib/bundles/flow/contextV2'
import os from 'protolib/bundles/os/context'
import os2 from 'protolib/bundles/os/context2'
import utils from 'protolib/bundles/utils/context'
import keys from 'protolib/bundles/keys/context'
import chatGPT from 'protolib/bundles/chatgpt/context'
import logs from 'protolib/bundles/logs/context'
import playwright from 'protolib/bundles/playwright/context'
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
    playwright
}