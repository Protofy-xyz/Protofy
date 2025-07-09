import devicesEditorMasks from 'protodevice/src/nodes'
import customVisualUIMasks from '../masks/custom.masks'
import uiBundleMasks from '@extensions/ui/masks';
import apiMasks from '@extensions/apis/masks';
import devicesMasks from '@extensions/devices/devices/masks';
import wledMasks from '@extensions/wled/masks';
import devicesUIMasks from '@extensions/devices/devices/uiMasks';
import baseMasks from '@extensions/basemasks';
import customEventMasks from '@extensions/events/masks'
import customMasks from '../masks'
import automationMasks from '@extensions/automations/masks';
// import resendMasks from '@extensions/resend/masks';
import flowMasks from '@extensions/flow/masks';
import flowMasks2 from '@extensions/flow2/masks';
import objectMasks from '@extensions/objects/masks';
import osMasks from '@extensions/os/masks'
import osMasks2 from '@extensions/os2/masks'
import utilsMasks from '@extensions/utils/masks'
import keyMasks from '@extensions/keys/masks'
import chatGPTMasks from '@extensions/chatgpt/masks'
// import discordMasks from '@extensions/discord/masks';
import logsMasks from '@extensions/logs/masks'
import playwrightMasks from '@extensions/playwright/masks'
import networkMasks from '@extensions/network/masks'
import stateMachineMasks from '@extensions/statemachines/masks'
import stateMasks from '@extensions/state/masks'
import { paths } from './flows';

import boardMasks from '@extensions/boards/boardMasks'

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
        ...wledMasks,
        ...customMasks.api,
        ...flowMasks,
        ...flowMasks2,
        ...customEventMasks.api,
        ...apiMasks,
        ...devicesMasks,
        ...baseMasks.api,
        ...automationMasks,
        // ...resendMasks,
        ...objectMasks,
        ...osMasks,
        ...osMasks2,
        ...keyMasks,
        ...utilsMasks,
        ...chatGPTMasks,
        // ...discordMasks,
        ...logsMasks,
        ...playwrightMasks,
        ...networkMasks,
        ...stateMachineMasks,
        ...stateMasks
    ]

    if( paths.boards.includes(segment) ) return [
        ...boardMasks,
        ...baseMasks.api
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