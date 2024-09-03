export const paths = {
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

export const getFlowsMenuConfig = (path: string, queryParams: {}) => {
    const pathParts = path.split('/')
    const segment = pathParts[pathParts.length - 1]
    const query = JSON.stringify(queryParams)

    if (paths.devices.includes(segment)) return {
        visibleTabs: ["nodes"]
    }
    if (paths.visualui.includes(segment) || (query && paths.visualui.find(p => query.includes(p)))) return {}
    if (paths.apis.includes(segment)) return {}
    return {}
}