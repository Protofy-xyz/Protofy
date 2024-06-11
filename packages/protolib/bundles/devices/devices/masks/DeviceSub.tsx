import { Node, NodeParams, FlowPort, FallbackPort, getFieldValue } from 'protoflow';
import { useState, useEffect } from 'react';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';
import { filterCallback, restoreCallback } from 'protoflow';
import { DeviceCollection } from '../../models/DeviceModel';
import { getDevices } from '../../devicesUtils';

const DeviceSub = ({ node = {}, nodeData = {}, children }: any) => {

    // const [payloadVisibility, setPayloadVisibility] = useState(false);
    let deviceName = getFieldValue("param-3", nodeData);
    let deviceComponent = deviceName ? getFieldValue("param-4", nodeData) : "";
    let deviceMonitor = deviceName ? getFieldValue("param-5", nodeData) : "";

    const color = useColorFromPalette(7)
    const [devicesData, setDevicesData] = useState<any[]>([]);

    const deviceCollection = new DeviceCollection(devicesData);

    const deviceNames = deviceCollection?.getNames() ?? [];
    const deviceSubsystemsNames = deviceCollection?.getSubsystemsNames(deviceName, "monitor") ?? [];
    const subsystemMonitorNames = deviceCollection.getSubsystemHandler(deviceName, deviceComponent, "monitor") ?? [];

    useEffect(() => {
        const updateDevices = async () => {
            const devices = await getDevices();
            setDevicesData(devices);
        }

        if (node.id) {
            updateDevices()
        }
    }, [])

    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Device Subscribe' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Device name', field: 'param-3', type: 'select', static: true, data: deviceNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Component', field: 'param-4', type: 'select', static: true, data: deviceSubsystemsNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Monitor', field: 'param-5', type: 'select', static: true, data: subsystemMonitorNames }]} />
            {
                (deviceName && deviceComponent && deviceMonitor) ?
                    <div style={{ marginTop: "55px" }}>
                        <FlowPort id={node.id} type='output' label='On (message, topic, done)' style={{ top: '235px' }} handleId={'request'} />
                        <FallbackPort node={node} port={'param-6'} type={"target"} fallbackPort={'request'} portType={"_"} preText="async (message, topic, done) => " postText="" />
                    </div> : null
            }
        </Node>
    )
}
export default {
    id: 'deviceSub',
    type: 'CallExpression',
    category: "ioT",
    keywords: ["automation", 'esp32', 'device', 'iot', 'trigger'],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('context.deviceSub'),
    getComponent: (node, nodeData, children) => (
        <DeviceSub node={node} nodeData={nodeData} children={children} />
    ),
    filterChildren: filterCallback("6"),
    restoreChildren: restoreCallback("6"),
    getInitialData: () => {
        return {
            to: 'context.deviceSub',
            "param-1": { value: "context.mqtt", kind: "Identifier" },
            "param-2": { value: "context", kind: "Identifier" },
            "param-3": { value: "", kind: "StringLiteral" },
            "param-4": { value: "", kind: "StringLiteral" },
            "param-5": { value: "", kind: "StringLiteral" },
            "param-6": { value: 'async (message, topic, done) =>', kind: 'Identifier' }
        }
    }
}
