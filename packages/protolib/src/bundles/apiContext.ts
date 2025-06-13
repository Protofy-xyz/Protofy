import { sendMailWithResend } from './resend/context'
import utils from './utils/context'
import playwright from './playwright/context'
import wledContext from './wled/context'
import stateMachines from './stateMachines/context'
import stateContext from './state/context'
import twilio from './twilio/context'

export const APIContext = {
    fetch,
    sendMailWithResend,
    ...wledContext,
    utils,
    playwright,
    sm: stateMachines,
    state: stateContext,
    twilio
}