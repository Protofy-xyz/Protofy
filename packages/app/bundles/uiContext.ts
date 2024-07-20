import { fetch, actionFetch, navigate, onRender, actionNavigate } from 'protolib/dist/bundles/ui/context';
import flow from 'protolib/dist/bundles/flow/context'
import deviceContext from 'protolib/dist/bundles/devices/devices/uiContext'
import object from 'protolib/dist/bundles/objects/context'
import os from 'protolib/dist/bundles/os/context'
import flow2 from 'protolib/dist/bundles/flow/contextV2'

export const context = {
    fetch,
    actionFetch,
    navigate,
    flow,
    flow2,
    object,
    onRender,
    actionNavigate,
    ...deviceContext
}