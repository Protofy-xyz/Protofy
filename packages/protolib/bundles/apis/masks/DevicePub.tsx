import { Node, Field, NodeParams } from 'protoflow';
import { API } from 'protolib';
import { useState, useEffect } from 'react';

const getDeviceSubsystemsNames = (devData) => {
    const deviceSubsystems = {}
    devData?.forEach(device => {
        const subsystemsNames = device?.subsystem?.filter(sub => sub?.actions && sub?.actions?.length).map(sub => '"' + sub.name + '"')
        deviceSubsystems['"' + device.name + '"'] = subsystemsNames
    });
    return deviceSubsystems
}

const getSubsystemsActions = (devData) => {
    const deviceSubsystemsActions = {};

    devData.forEach(device => {
        const deviceName = '"' + device.name + '"';
        const actions = {};

        device.subsystem?.forEach(subsystem => {
            subsystem.actions?.forEach(action => {
                actions['"' + subsystem.name + '"'] = actions['"' + subsystem.name + '"'] || [];
                actions['"' + subsystem.name + '"'].push('"' + action.name + '"');
            });
        });

        deviceSubsystemsActions[deviceName] = actions;
    });
    return deviceSubsystemsActions

}
const getDeviceNames = (devData) => devData?.map((device) => '"' + device.name + '"')


const DevicePub = ({ node = {}, nodeData = {}, children }: any) => {
    const [devicesData, setDevicesData] = useState<any[]>([]);

    let deviceName = nodeData['param1'];
    let deviceComponent = nodeData['param2'];
    let deviceAction = nodeData['param3'];

    const getDevices = async () => {
        const { data } = await API.get("/adminapi/v1/devices")
        const devices = data.items;
        setDevicesData([...devices]);
    }

    useEffect(() => {
        getDevices()
    }, [])

    const nodeParams: Field[] = [
        {
            label: 'Device name', field: 'param1', type: 'selectWithDefault', static: true,
            selectedIndex: getDeviceNames(devicesData)?.indexOf(deviceName) ?? 0,
            data: devicesData ? getDeviceNames(devicesData) : ['"none"'],
        },
        {
            label: 'Component', field: 'param2', type: 'selectWithDefault', static: true,
            selectedIndex: getDeviceSubsystemsNames(devicesData)[deviceName]?.indexOf(deviceComponent) ?? 0,
            data: devicesData ? (getDeviceSubsystemsNames(devicesData)[deviceName] ?? []) : ['"none"'],
        },
        {
            label: 'Action', field: 'param3', type: 'selectWithDefault', static: true,
            selectedIndex: devicesData && getSubsystemsActions(devicesData)[deviceName] ? getSubsystemsActions(devicesData)[deviceName][deviceComponent]?.indexOf(deviceAction) ?? [] : 0,
            data: devicesData && getSubsystemsActions(devicesData)[deviceName] ? getSubsystemsActions(devicesData)[deviceName][deviceComponent] ?? [] : ['"none"'],
        }
    ] as Field[]

    return (
        <Node node={node} isPreview={!node.id} title='devicePub' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}
export default DevicePub