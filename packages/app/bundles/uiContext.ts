import { fetch, navigate, onRender, actionNavigate } from 'protolib/bundles/ui/context';
import flow from 'protolib/bundles/flow/context'
import deviceContext from 'protolib/bundles/devices/context/ui'
export const context = {
    fetch,
    navigate,
    flow,
    onRender,
    ...deviceContext
}