import { fetch, actionFetch, navigate, onRender, actionNavigate } from 'protolib/bundles/ui/context';
import flow from 'protolib/bundles/flow/context'
import deviceContext from 'protolib/bundles/devices/devices/uiContext'
import object from 'protolib/bundles/objects/context'
import os from 'protolib/bundles/os/context'
import flow2 from 'protolib/bundles/flow/contextV2'
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