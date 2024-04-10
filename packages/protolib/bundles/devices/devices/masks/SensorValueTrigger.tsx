import { Node, NodeParams, FlowPort, FallbackPort, getFieldValue } from 'protoflow';
import { useState, useEffect } from 'react';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';
import { filterCallback, restoreCallback } from 'protoflow';
import { DeviceRepository } from '../../repositories/deviceRepository';
import { DeviceCollection, DeviceModel } from '../../models/DeviceModel';
import { DeviceDataType, SubsystemType } from '../../models/interfaces';
import { SubsystemCollection, SubsystemModel } from '../../models/SubsystemModel';


const deviceRepository = new DeviceRepository()
const SensorValueTrigger = ({ node = {}, nodeData = {}, children }: any) => {

    // const [payloadVisibility, setPayloadVisibility] = useState(false);
    let deviceName = getFieldValue("param-1", nodeData);
    let deviceComponent = deviceName ? getFieldValue("param-2", nodeData) : "";
    let deviceMonitor = deviceName ? getFieldValue("param-3", nodeData) : "";

    const color = useColorFromPalette(8)
    const [devicesData, setDevicesData] = useState<any[]>([]);

    const getDevices = async () => {
        const { data } = await deviceRepository.list()
        const { items: devices } = data;
        setDevicesData([...devices]);
    }

    // Device
    const deviceCollection = new DeviceCollection(devicesData);
    const deviceNames = deviceCollection?.getNames() ?? [];
    const selectedDevice: DeviceDataType = deviceCollection.findByName(deviceName);
    const selectedDeviceModel = new DeviceModel(selectedDevice)
    // Subsystem
    const deviceSubsystems = selectedDeviceModel.getSubsystems()
    const subsystemsCollection = new SubsystemCollection(deviceSubsystems);
    const deviceSubsystemsNames = selectedDeviceModel.getSubsystemNames('monitor') ?? [];
    const selectedSubsystem: SubsystemType = subsystemsCollection.findByName(deviceComponent);
    const selectedSubsystemModel = new SubsystemModel(selectedSubsystem)
    // Monitor
    const subsystemMonitorNames = selectedSubsystemModel.getMonitorsNames() ?? [];
    // const selectedMonitor = selectedSubsystemModel.getActionByName(deviceMonitor?.replaceAll('"', ''))

    useEffect(() => {
        getDevices()
    }, [])

    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Sensor Value Trigger' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Device name', field: 'param-1', type: 'select', static: true, data: deviceNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Component', field: 'param-2', type: 'select', static: true, data: deviceSubsystemsNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Monitor', field: 'param-3', type: 'select', static: true, data: subsystemMonitorNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Desired value', static: true, field: 'param-5', type: 'input' }]} />

            {
                // (deviceName && deviceComponent && deviceMonitor) ?
                <div style={{ marginTop: "120px" }}>
                    <FlowPort id={node.id} type='output' label='equalAction(sensorValue)' style={{ top: '300px' }} handleId={'equal'} />
                    <FallbackPort fallbackText="null" node={node} port={'param-6'} type={"target"} fallbackPort={'equal'} portType={"_"} preText="async (sensorValue) => " postText="" />
                    <FlowPort id={node.id} type='output' label='differentAction(sensorValue)' style={{ top: '350px' }} handleId={'different'} />
                    <FallbackPort fallbackText="null" node={node} port={'param-7'} type={"target"} fallbackPort={'different'} portType={"_"} preText="async (sensorValue) => " postText="" />
                </div>
                // : null
            }
        </Node>
    )
}
export default {
    id: 'sensorValueTrigger',
    type: 'CallExpression',
    category: "ioT",
    keywords: ["trigger", 'sensor', "value", 'esp32', 'device', 'iot'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.sensorValueTrigger')
    },
    getComponent: (node, nodeData, children) => <SensorValueTrigger node={node} nodeData={nodeData} children={children} />,
    filterChildren: (node, childScope, edges)=> {
        childScope = filterCallback("6","equal")(node,childScope,edges)
        childScope = filterCallback("7","different")(node,childScope,edges)
        return childScope
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges) => {
        let result = restoreCallback("6")(node, nodes, originalNodes, edges, originalEdges)
        result = restoreCallback("7")(node, result.nodes, originalNodes, result.edges, originalEdges)
        return result
    },
    getInitialData: () => {
        return {
            to: 'context.sensorValueTrigger',
            "param-1": {
                value: "",
                kind: "StringLiteral"
            },
            "param-2": {
                value: "",
                kind: "StringLiteral"
            },
            "param-3": {
                value: "",
                kind: "StringLiteral"
            },
            "param-4": {
                value: "context",
                kind: "Identifier"
            },
            "param-5": {
                value: 1.5,
                kind: "StringLiteral"
            },
            "param-6": {
                value: "null",
                kind: "Identifier"
            },
            "param-7": {
                value: "null",
                kind: "Identifier"
            }
        }
    }
}
