import { sendMailWithResend } from './resend/context'
import object from './objects/context'
import os from './os/context'
import os2 from './os/context2'
import utils from './utils/context'
import keys from './keys/context'

import logs from './logs/context'
import playwright from './playwright/context'
import network from './network/context'
import deviceContext from './devices/devices/context'
import wledContext from './wled/context'
import stateMachines from './stateMachines/context'
import stateContext from './state/context'
import lmstudio from './lmstudio/context'
import twilio from './twilio/context'
import whatsapp from './whatsapp/context'

export const APIContext = {
    fetch,
    sendMailWithResend,
    ...deviceContext,
    ...wledContext,
    keys,
    object,
    os,
    os2,
    utils,
    logs,
    playwright,
    network,
    sm: stateMachines,
    state: stateContext,
    lmstudio,
    twilio,
    whatsapp
}