import { sendMailWithResend } from './resend/context'
import object from './objects/context'
import os from './os/context'
import os2 from './os/context2'
import utils from './utils/context'
import playwright from './playwright/context'
import network from './network/context'
import wledContext from './wled/context'
import stateMachines from './stateMachines/context'
import stateContext from './state/context'
import twilio from './twilio/context'

export const APIContext = {
    fetch,
    sendMailWithResend,
    ...wledContext,
    object,
    os,
    os2,
    utils,
    playwright,
    network,
    sm: stateMachines,
    state: stateContext,
    twilio
}