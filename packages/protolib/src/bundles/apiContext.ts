import { onEvent, emitEvent, getLastEvent } from './events/api'
import { automation, fetch, automationResponse, executeAutomation, getServiceToken, serviceToken } from './apis/context/'
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
import discord from './discord/context'
import logs from './logs/context'
import playwright from './playwright/context'
import automations from './automations/context'
import network from './network/context'
import deviceContext from './devices/devices/context'
import wledContext from './wled/context'
import stateMachines from './stateMachines/context'
import stateContext from './state/context'
import cards from './cards/context'
import lmstudio from './lmstudio/context'
import protomemdb from './protomemdb/context'
import autopilot from './autopilot/context'
import chatbots from './chatbots/context'
import twilio from './twilio/context'
import whatsapp from './whatsapp/context'


export const APIContext = {
    onEvent,
    emitEvent,
    getLastEvent,
    automation,
    automationResponse,
    getServiceToken,
    serviceToken,
    fetch,
    createSchedule,
    createPeriodicSchedule,
    sendMailWithResend,
    executeAutomation,
    ...deviceContext,
    ...wledContext,
    keys,
    chatGPT,
    discord,
    flow,
    flow2,
    object,
    os,
    os2,
    utils,
    logs,
    playwright,
    automations,
    network,
    sm: stateMachines,
    state: stateContext,
    cards,
    lmstudio,
    protomemdb,
    autopilot,
    chatbots,
    twilio,
    whatsapp
}