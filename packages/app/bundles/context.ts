import machineDefinitions from './stateMachines'
import context from './coreContext'

import discord from '@extensions/discord/context'
import flow from '@extensions/flow/context'
import flow2 from '@extensions/flow2/context'
import whatsapp from '@extensions/whatsapp/context'
import lmstudio from '@extensions/lmstudio/context'
import logs from '@extensions/logs/context'
import network from '@extensions/network/context'
import os from '@extensions/os/context'
import os2 from '@extensions/os/context2'
import playwright from '@extensions/playwright/context'
import resend from '@extensions/resend/context'
import wledContext from '@extensions/wled/context'
import twilio from '@extensions/twilio/context'

export default {
    machineDefinitions: {
        ...machineDefinitions
    },
    ...context,
    discord,
    flow,
    flow2,
    whatsapp,
    lmstudio,
    logs,
    network,
    os,
    os2,
    playwright,
    resend,
    ...wledContext,
    twilio
}