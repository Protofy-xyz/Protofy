import { fetch, actionFetch, navigate, onRender, actionNavigate } from '@extensions/ui/uiContext';
import flow from '@extensions/flow/context'
import deviceContext from '@extensions/devices/devices/uiContext'
import object from '@extensions/objects/coreContext'
import flow2 from '@extensions/flow2/context'
import twilio from '@extensions/twilio/uiContext'

export const context = {
    fetch,
    actionFetch,
    navigate,
    flow,
    flow2,
    object,
    onRender,
    actionNavigate,
    ...deviceContext,
    twilio
}