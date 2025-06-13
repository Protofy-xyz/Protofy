

import stateMachines from './stateMachines/context'
import twilio from './twilio/context'

export const APIContext = {
    fetch,
    sm: stateMachines,
    twilio
}