import devicesMasks from 'protodevice/src/nodes'
import visualuiTemplateMasks from 'visualui/src/masks/UI.mask.json';
import customVisualUIMasks from 'app/bundles/custom/masks/custom.masks.json'
import { BaseJSMasks } from 'protoflow';
import apiMasks from 'protolib/bundles/apis/masks';
import customMasks from 'app/bundles/custom/masks'
import customEventMasks from 'protolib/bundles/events/masks'
const paths = {
    devices: [
        'devices',
        'deviceDefinitions',
        'deviceBoards',
        'deviceCores',
        'deviceSdks'
    ],
    visualui: [
        'visualui',
    ],
    apis:[
        'apis'
    ]
}

export const getFlowsCustomComponents = (path: string, queryParams: {}) => {
    const pathParts = path.split('/')
    const segment = pathParts[pathParts.length - 1]
    const query = JSON.stringify(queryParams)

    if (paths.devices.includes(segment)) return devicesMasks
    if (paths.visualui.includes(segment) || (query && paths.visualui.find(p => query.includes(p)))) return []
    if (paths.apis.includes(segment)) return [
        //...customMasks.api, //uncomment to wire your custom masks from custom bundle
        ...customEventMasks.api,
        ...apiMasks
    ]
    return []
}

export const getFlowMasks = (path: string, queryParams: {}) => {
    const pathParts = path.split('/')
    const segment = pathParts[pathParts.length - 1]
    const query = JSON.stringify(queryParams)

    if (paths.visualui.includes(segment) || (query && paths.visualui.find(p => query.includes(p)))) {
        return [...visualuiTemplateMasks, ...customVisualUIMasks, ...BaseJSMasks]
    }

    return [...customVisualUIMasks]
}