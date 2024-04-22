import { fetch, actionFetch, navigate, onRender, actionNavigate } from 'protolib/bundles/ui/context';
import flow from 'protolib/bundles/flow/context'
import deviceContext from 'protolib/bundles/devices/context/ui'
import object from 'protolib/bundles/objects/context'
import os from 'protolib/bundles/os/context'
export const context = {
    fetch,
    actionFetch,
    navigate,
    flow,
    object,
    onRender,
    actionNavigate,
    ...deviceContext
}