import flowSnippets from 'protolib/bundles/flow/snippets';
import customSnippets from './custom/snippets';

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

export const getFlowsCustomSnippets = (path: string, queryParams: {}) => {
    const pathParts = path.split('/')
    const segment = pathParts[pathParts.length - 1]
    const query = JSON.stringify(queryParams)

    if (paths.devices.includes(segment)) return []//devicesEditorMasks
    if (paths.visualui.includes(segment) || (query && paths.visualui.find(p => query.includes(p)))) return [
        
    ]
    if (paths.apis.includes(segment)) return [
        ...flowSnippets,
        ...customSnippets?.api ?? []
    ]
    return []
}