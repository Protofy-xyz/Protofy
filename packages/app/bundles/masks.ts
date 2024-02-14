import devicesMasks from 'protodevice/src/nodes'
import visualuiTemplateMasks from 'visualui/src/masks/UI.mask.json';
import customVisualUIMasks from 'app/bundles/custom/masks/custom.masks.json'

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
    ]
}

export const getFlowsCustomComponents = (path: string, queryParams: {}) => {
    const pathParts = path.split('/')
    const segment = pathParts[pathParts.length - 1]
    const query = JSON.stringify(queryParams)

    if (paths.devices.includes(segment)) return devicesMasks
    if (paths.visualui.includes(segment) || (query && paths.visualui.find(p => query.includes(p)))) return []

    return []
}

export const getFlowMasks = (path: string, queryParams: {}) => {
    const pathParts = path.split('/')
    const segment = pathParts[pathParts.length - 1]
    const query = JSON.stringify(queryParams)

    if (paths.visualui.includes(segment) || (query && paths.visualui.find(p => query.includes(p)))) {
        return [...visualuiTemplateMasks, customVisualUIMasks]
    }

    return []
}