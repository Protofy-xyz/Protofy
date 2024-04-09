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
const SensorRangeEnforcer = ({ node = {}, nodeData = {}, children }: any) => {

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
        <Node icon={Cable} node={node} isPreview={!node.id} title='SensorRangeEnforcer' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Device name', field: 'param-1', type: 'select', static: true, data: deviceNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Component', field: 'param-2', type: 'select', static: true, data: deviceSubsystemsNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Monitor', field: 'param-3', type: 'select', static: true, data: subsystemMonitorNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Desired value', static: true, field: 'param-5', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Threshold', static: true, field: 'param-6', type: 'input' }]} />

            {
                // (deviceName && deviceComponent && deviceMonitor) ?
                <div style={{ marginTop: "200px" }}>
                    <FlowPort id={node.id} type='output' label='aboveAction(delta)' style={{ top: '360px' }} handleId={'request'} />
                    <FallbackPort node={node} port={'param-7'} type={"target"} fallbackPort={'request'} portType={"_"} preText="async (delta) => " postText="" />
                    <FlowPort id={node.id} type='output' label='belowAction(delta)' style={{ top: '410px' }} handleId={'below'} />
                    <FallbackPort node={node} port={'param-8'} type={"target"} fallbackPort={'below'} portType={"_"} preText="async (delta) => " postText="" />
                    <FlowPort id={node.id} type='output' label='onRangeAction(delta)' style={{ top: '460px' }} handleId={'range'} />
                    <FallbackPort node={node} port={'param-9'} type={"target"} fallbackPort={'range'} portType={"_"} preText="async (delta) => " postText="" />
                </div>
                // : null
            }
        </Node>
    )
}
export default {
    id: 'sensorRangeEnforcer',
    type: 'CallExpression',
    category: "ioT",
    keywords: ["control", 'sensor', "feedback loop", 'esp32', 'device', 'iot'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.sensorRangeEnforcer')
    },
    getComponent: (node, nodeData, children) => <SensorRangeEnforcer node={node} nodeData={nodeData} children={children} />,
    filterChildren: (node, childScope, edges)=>{
        childScope = filterCallback("7")(node,childScope,edges)
        childScope = filterCallback("8","below")(node,childScope,edges)
        childScope = filterCallback("9","range")(node,childScope,edges)
        return childScope
    },
    // restoreChildren:  (node, nodes, originalNodes, edges, originalEdges) =>{
    //     let result = restoreCallback("7")(node, nodes, originalNodes, edges, originalEdges)
    //     result = restoreCallback("8")(node, result.nodes, originalNodes, result.edges, originalEdges)
    //     result = restoreCallback("9")(node, result.nodes, originalNodes, result.edges, originalEdges)
    //     return result
    // },
    getInitialData: () => {
        return {
            to: 'context.sensorRangeEnforcer',
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
                value: 0.3,
                kind: "StringLiteral"
            },
            "param-7": {
                value: "null",
                kind: "Identifier"
            },
            "param-8": {
                value: "null",
                kind: "Identifier"
            },
            "param-9": {
                value: "null",
                kind: "Identifier"
            }
        }
    }
}
