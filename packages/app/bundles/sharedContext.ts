import { onEvent, emitEvent, getLastEvent } from '@extensions/events/api'
import protomemdb from '@extensions/protomemdb/context'
import actions from '@extensions/actions/context'
import { automation, fetch, automationResponse, executeAutomation, getServiceToken, serviceToken } from '@extensions/apis/context/'
import chatGPT from '@extensions/chatgpt/context'
import automations from '@extensions/automations/context'
import {createSchedule} from '@extensions/automations/schedule'
import {createPeriodicSchedule} from '@extensions/automations/periodicSchedule'
import autopilot from '@extensions/autopilot/context'
import cards from '@extensions/cards/context'
import chatbots from '@extensions/chatbots/context'
import keys from '@extensions/keys/context'
import deviceContext from '@extensions/devices/devices/context'
import object from '@extensions/objects/context'

export default {
    onEvent,
    emitEvent,
    getLastEvent,
    protomemdb,
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
    autopilot,
    cards,
    chatbots,
    keys,
    object,
    ...deviceContext
}