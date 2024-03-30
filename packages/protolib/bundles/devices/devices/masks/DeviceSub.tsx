import { Node, Field, NodeParams, FlowPort, FallbackPort } from 'protoflow';
import { API, Text } from 'protolib';
import { useState, useEffect } from 'react';
import {useColorFromPalette} from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';

import { filterCallback, restoreCallback } from 'protoflow';

const getDeviceSubsystemsNames = (devData) => {
    const deviceSubsystems = {}
    devData?.forEach(device => {
        const subsystemsNames = device?.subsystem?.filter(sub => sub?.monitors && sub?.monitors?.length).map(sub => '"' + sub.name + '"')
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

const getSubsystemsMonitors = (devData) => {
    const deviceSubsystemsMonitors = {};

    devData.forEach(device => {
        const deviceName = '"' + device.name + '"';
        const monitors = {};

        device.subsystem?.forEach(subsystem => {
            subsystem.monitors?.forEach(monitor => {
                monitors['"' + subsystem.name + '"'] = monitors['"' + subsystem.name + '"'] || [];
                monitors['"' + subsystem.name + '"'].push('"' + monitor.name + '"');
            });
        });

        deviceSubsystemsMonitors[deviceName] = monitors;
    });
    console.log("DeviceSubsystemsMonitors: ", deviceSubsystemsMonitors)
    return deviceSubsystemsMonitors

}

const getDeviceNames = (devData) => devData?.map((device) => '"' + device.name + '"')


const DeviceSub = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(7)
    const [devicesData, setDevicesData] = useState<any[]>([]);
    // const [payloadVisibility, setPayloadVisibility] = useState(false);
    let deviceName = nodeData['param1'];
    let deviceComponent = nodeData['param2'];
    let deviceMonitor= nodeData['param3'];

    // const updatePayloadVisibility = async (devicesData) => {
    //     const subsystem = devicesData.filter( device => device.name === deviceName.replaceAll('"', ''))[0]?.subsystem
    //     const actions = subsystem?.filter( subsystem => subsystem.name === deviceComponent.replaceAll('"', ''))[0]?.actions
    //     // const payloadValue = actions?.filter( action => action.name === deviceAction.replaceAll('"', ''))[0]?.payload?.value
    //     // setPayloadVisibility(payloadValue ? true : false)
    // }
    const getDevices = async () => {
        const { data } = await API.get("/adminapi/v1/devices")
        console.log("Readed deviceSub items: ",data)
        const devices = data?.items;
        setDevicesData([...devices]);
        // updatePayloadVisibility(devices)
    }

    useEffect(() => {
        getDevices()
    }, [])
    
    // useEffect(() => {
    //     updatePayloadVisibility(devicesData)
    // }, [deviceAction])

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
            label: 'Monitor', field: 'param3', type: 'selectWithDefault', static: true,
            selectedIndex: devicesData && getSubsystemsMonitors(devicesData)[deviceName] ? getSubsystemsMonitors(devicesData)[deviceName][deviceComponent]?.indexOf(deviceMonitor) ?? [] : 0,
            data: devicesData && getSubsystemsMonitors(devicesData)[deviceName] ? getSubsystemsMonitors(devicesData)[deviceName][deviceComponent] ?? [] : ['"none"'],
        }
    ] as Field[]

    // const actionPayloadNodeParams: Field[] = [
    //     {
    //         label: 'Action payload', field: 'param4', type: 'input', static: true,
    //     }
    // ] as Field[]
    
    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Device Listener' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
            {/* {payloadVisibility ? <></> : <NodeParams id={node.id} params={actionPayloadNodeParams} />} */}
            <div style={{ marginTop: "35px" }}>
                <FlowPort id={node.id} type='output' label='On (message, topic)' style={{ top: '225px' }} handleId={'request'} />
                <FallbackPort node={node} port={'param4'} type={"target"} fallbackPort={'request'} portType={"_"} preText="(message,topic) => " postText="" />
            </div>
        </Node>
    )
}
export default {
    id: 'deviceSub',
    type: 'CallExpression',
    category: "ioT",
    keywords: ["automation", 'esp32', 'device', 'iot', 'trigger'],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('context.deviceSub'),
    getComponent: (node, nodeData, children) => <DeviceSub node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterCallback("4"),
    restoreChildren: restoreCallback("4"),
    getInitialData: () => { return { to: 'context.deviceSub', param1: '"none"', param2: '"none"', param3: '"none"', param4: '(message,topic) =>' } }
}
