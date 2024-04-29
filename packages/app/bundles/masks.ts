import devicesEditorMasks from 'protodevice/src/nodes'
import customVisualUIMasks from 'app/bundles/custom/masks/custom.masks.json'
import uiBundleMasks from 'protolib/bundles/ui/masks';
import apiMasks from 'protolib/bundles/apis/masks';
import deviceAction from 'protolib/bundles/apis/masks/DeviceAction';
import devicesMasks from 'protolib/bundles/devices/devices/masks';
import devicesUIMasks from 'protolib/bundles/devices/devices/uiMasks';
import baseMasks from 'protolib/bundles/basemasks';
import customEventMasks from 'protolib/bundles/events/masks'
import customMasks from 'app/bundles/custom/masks'
import scheduleMasks from 'protolib/bundles/automations/masks';
import resendMasks from 'protolib/bundles/resend/masks';
import flowMasks from 'protolib/bundles/flow/masks';
import flowMasks2 from 'protolib/bundles/flow/masksV2';
import objectMasks from 'protolib/bundles/objects/masks';
import osMasks from 'protolib/bundles/os/masks'
import osMasks2 from 'protolib/bundles/os/masks2'
import utilsMasks from 'protolib/bundles/utils/masks'
import keyMasks from 'protolib/bundles/keys/masks'
import chatGPTMasks from 'protolib/bundles/chatgpt/masks'
import logsMasks from 'protolib/bundles/logs/masks'
import playwrightMasks from 'protolib/bundles/playwright/masks'

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
        ...keyMasks,
        deviceAction
    ]
    if (paths.apis.includes(segment)) return [
        ...customMasks.api,
        ...flowMasks,
        ...flowMasks2,
        ...customEventMasks.api,
        ...apiMasks,
        ...devicesMasks.api,
        ...baseMasks.api,
        ...scheduleMasks,
        ...resendMasks,
        ...objectMasks,
        ...osMasks,
        ...osMasks2,
        ...keyMasks,
        ...utilsMasks,
        ...chatGPTMasks,
        ...logsMasks,
        ...playwrightMasks
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