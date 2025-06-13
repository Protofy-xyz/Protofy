
import wledContext from './wled/context'
import stateMachines from './stateMachines/context'
import twilio from './twilio/context'

export const APIContext = {
    fetch,
    ...wledContext,
    sm: stateMachines,
    twilio
}