import { fetch, actionFetch, navigate, onRender, actionNavigate } from 'protolib/src/bundles/ui/context';
import flow from 'protolib/src/bundles/flow/context'
import deviceContext from 'protolib/src/bundles/devices/devices/uiContext'
import object from 'protolib/src/bundles/objects/context'
import os from 'protolib/src/bundles/os/context'
import flow2 from 'protolib/src/bundles/flow/contextV2'

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