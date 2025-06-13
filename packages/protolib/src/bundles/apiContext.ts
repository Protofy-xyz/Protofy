import utils from './utils/context'
import wledContext from './wled/context'
import stateMachines from './stateMachines/context'
import stateContext from './state/context'
import twilio from './twilio/context'

export const APIContext = {
    fetch,
    ...wledContext,
    utils,
    sm: stateMachines,
    state: stateContext,
    twilio
}