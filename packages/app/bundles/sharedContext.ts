import events from '@extensions/events/context'
import protomemdb from '@extensions/protomemdb/context'
import actions from '@extensions/actions/context'
import apis from '@extensions/apis/context/'
import chatGPT from '@extensions/chatgpt/context'
import automations from '@extensions/automations/context'
import autopilot from '@extensions/autopilot/context'
import cards from '@extensions/cards/context'
import chatbots from '@extensions/chatbots/context'
import keys from '@extensions/keys/context'
import devices from '@extensions/devices/devices/context'
import object from '@extensions/objects/context'
import state from '@extensions/state/context'
import utils from '@extensions/utils/context'
import stateMachines from '@extensions/stateMachines/context'

export default {
    events,
    protomemdb,
    actions,
    apis,
    chatGPT,
    automations,
    autopilot,
    cards,
    chatbots,
    keys,
    object,
    state,
    utils,
    stateMachines,
    devices
}