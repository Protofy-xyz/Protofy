import devicesMasks from 'protodevice/src/nodes'

const paths = {
    devices: [
        'devices', 
        'deviceDefinitions',
        'deviceBoards',
        'deviceCores',
        'deviceSdks'
    ]
}

export const getFlowMasks = (path: string) => {
    const pathParts = path.split('/')
    const segment = pathParts[pathParts.length - 1]

    if (paths.devices.includes(segment)) return devicesMasks 
    return []
}