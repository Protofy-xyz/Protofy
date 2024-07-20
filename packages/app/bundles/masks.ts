import { devicesEditorMasks } from 'protodevice'
import customVisualUIMasks from 'app/bundles/custom/masks/custom.masks'
import uiBundleMasks from 'protolib/dist/bundles/ui/masks';
import apiMasks from 'protolib/dist/bundles/apis/masks';
import devicesMasks from 'protolib/dist/bundles/devices/devices/masks';
import devicesUIMasks from 'protolib/dist/bundles/devices/devices/uiMasks';
import baseMasks from 'protolib/dist/bundles/basemasks';
import customEventMasks from 'protolib/dist/bundles/events/masks'
import customMasks from 'app/bundles/custom/masks'
import automationMasks from 'protolib/dist/bundles/automations/masks';
import resendMasks from 'protolib/dist/bundles/resend/masks';
import flowMasks from 'protolib/dist/bundles/flow/masks';
import flowMasks2 from 'protolib/dist/bundles/flow/masksV2';
import objectMasks from 'protolib/dist/bundles/objects/masks';
import osMasks from 'protolib/dist/bundles/os/masks'
import osMasks2 from 'protolib/dist/bundles/os/masks2'
import utilsMasks from 'protolib/dist/bundles/utils/masks'
import keyMasks from 'protolib/dist/bundles/keys/masks'
import chatGPTMasks from 'protolib/dist/bundles/chatgpt/masks'
import logsMasks from 'protolib/dist/bundles/logs/masks'
import playwrightMasks from 'protolib/dist/bundles/playwright/masks'
import networkMasks from 'protolib/dist/bundles/network/masks'

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

    if (paths.devices.includes(segment)) return devicesEditorMasks
    if (paths.visualui.includes(segment) || (query && paths.visualui.find(p => query.includes(p)))) return [
        ...flowMasks,
        ...flowMasks2,
        ...uiBundleMasks.code,
        ...devicesUIMasks,
        ...objectMasks,
        ...baseMasks.api,
        ...keyMasks
    ]
    if (paths.apis.includes(segment)) return [
        ...customMasks.api,
        ...flowMasks,
        ...flowMasks2,
        ...customEventMasks.api,
        ...apiMasks,
        ...devicesMasks,
        ...baseMasks.api,
        ...automationMasks,
        ...resendMasks,
        ...objectMasks,
        ...osMasks,
        ...osMasks2,
        ...keyMasks,
        ...utilsMasks,
        ...chatGPTMasks,
        ...logsMasks,
        ...playwrightMasks,
        ...networkMasks
    ]
    return []
}

export const getFlowMasks = (path: string, queryParams: {}) => {
    const pathParts = path.split('/')
    const segment = pathParts[pathParts.length - 1]
    const query = JSON.stringify(queryParams)

    if (paths.visualui.includes(segment) || (query && paths.visualui.find(p => query.includes(p)))) {
        return [
            ...customVisualUIMasks,
            ...uiBundleMasks.dynamic
        ]
    }

    return [...customVisualUIMasks]
}