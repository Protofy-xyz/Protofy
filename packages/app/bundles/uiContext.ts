import { fetch, actionFetch, navigate, onRender, actionNavigate } from '@extensions/ui/context';
import flow from '@extensions/flow/context'
import deviceContext from '@extensions/devices/devices/uiContext'
import object from '@extensions/objects/context'
import flow2 from '@extensions/flow/contextV2'
import twilio from 'protolib/bundles/twilio/uiContext'

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