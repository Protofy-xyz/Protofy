import devicesEditorMasks from 'protodevice/src/nodes'
import customVisualUIMasks from 'app/bundles/custom/masks/custom.masks'
import uiBundleMasks from 'protolib/src/bundles/ui/masks';
import apiMasks from 'protolib/src/bundles/apis/masks';
import devicesMasks from 'protolib/src/bundles/devices/devices/masks';
import devicesUIMasks from 'protolib/src/bundles/devices/devices/uiMasks';
import baseMasks from 'protolib/src/bundles/basemasks';
import customEventMasks from 'protolib/src/bundles/events/masks'
import customMasks from 'app/bundles/custom/masks'
import automationMasks from 'protolib/src/bundles/automations/masks';
import resendMasks from 'protolib/src/bundles/resend/masks';
import flowMasks from 'protolib/src/bundles/flow/masks';
import flowMasks2 from 'protolib/src/bundles/flow/masksV2';
import objectMasks from 'protolib/src/bundles/objects/masks';
import osMasks from 'protolib/src/bundles/os/masks'
import osMasks2 from 'protolib/src/bundles/os/masks2'
import utilsMasks from 'protolib/src/bundles/utils/masks'
import keyMasks from 'protolib/src/bundles/keys/masks'
import chatGPTMasks from 'protolib/src/bundles/chatgpt/masks'
import logsMasks from 'protolib/src/bundles/logs/masks'
import playwrightMasks from 'protolib/src/bundles/playwright/masks'
import networkMasks from 'protolib/src/bundles/network/masks'

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