import { Node, NodeParams, getFieldValue, FallbackPort, FlowPort, filterCallback, restoreCallback } from 'protoflow';
import { useState, useEffect } from 'react';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Play } from 'lucide-react';
import { DeviceRepository } from '../../repositories/deviceRepository';
import { DeviceCollection, DeviceModel } from '../../models/DeviceModel';
import { DeviceDataType, SubsystemType } from '../../models/interfaces';
import { SubsystemCollection, SubsystemModel } from '../../models/SubsystemModel';

const deviceRepository = new DeviceRepository()
const DeviceAction = (node: any = {}, nodeData = {}) => {
    let deviceName = getFieldValue("param-1", nodeData);
    let deviceComponent = deviceName ? getFieldValue("param-2", nodeData) : "";
    let deviceAction = deviceName ? getFieldValue("param-3", nodeData) : "";
    const [devicesData, setDevicesData] = useState<any[]>([]);
    const color = useColorFromPalette(6)

    const getDevices = async () => {
        const { data } = await deviceRepository.list('dev')
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
    const deviceSubsystemsNames = selectedDeviceModel.getSubsystemNames('action') ?? [];
    const selectedSubsystem: SubsystemType = subsystemsCollection.findByName(deviceComponent);
    const selectedSubsystemModel = new SubsystemModel(selectedSubsystem)
    // Action
    const subsystemActionNames = selectedSubsystemModel.getActionsNames() ?? [];
    const selectedAction = selectedSubsystemModel.getActionByName(deviceAction)
    const actionValue = selectedAction?.payload?.value;

    useEffect(() => {
        if(node.id) getDevices()
    }, [])

    const hasPayload = !actionValue && deviceAction && deviceAction !== ''
    return (
        <Node icon={Play} node={node} isPreview={!node.id} title='Device Action' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Device name', field: 'param-1', type: 'select', data: deviceNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Component', field: 'param-2', type: 'select', data: deviceSubsystemsNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Action', field: 'param-3', type: 'select', data: subsystemActionNames }]} />
            {hasPayload && <NodeParams id={node.id} params={[{ label: 'Action payload', field: 'param-4', type: 'input' }]} />}

            <div style={{marginTop: '120px'}}>
                <FlowPort id={node.id} type='input' label='On done (data)' style={{ top: hasPayload ? '300px' : '250px' }} handleId={'param-5'} />
                <FallbackPort fallbackText={"null"} node={node} port={'param-5'} type={"target"} fallbackPort={'param-5'} portType={"_"} preText="async () => " postText="" />
                <FlowPort id={node.id} type='input' label='On error (error)' style={{ top: hasPayload ? '350px' : '300px' }} handleId={'param-6'} />
                <FallbackPort fallbackText={"null"} node={node} port={'param-6'} type={"target"} fallbackPort={'param-6'} portType={"_"} preText="async () => " postText="" />
            </div>
        </Node>
    )
}

export default {
    id: 'DeviceAction',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression" &&
            nodeData.to == 'context.deviceAction'
        );
    },
    category: "ioT",
    keywords: ['action', "automation", 'esp32', 'device', 'iot'],
    getComponent: DeviceAction,
    filterChildren: (node, childScope, edges) => {
        childScope = filterCallback("5", "param-5")(node, childScope, edges)
        childScope = filterCallback("6", "param-6")(node, childScope, edges)
        return childScope
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges) => {
        let result = restoreCallback("5")(node, nodes, originalNodes, edges, originalEdges)
        result = restoreCallback("6")(node, result.nodes, originalNodes, result.edges, originalEdges)
        return result
    },
    getInitialData: () => {
        return {
            to: 'context.deviceAction',
            "param-1": { value: "", kind: "StringLiteral" },
            "param-2": { value: "", kind: "StringLiteral" },
            "param-3": { value: "", kind: "StringLiteral" },
            "param-4": { value: "undefined", kind: "Identifier" },
            "param-5": { value: "null", kind: "Identifier" },
            "param-6": { value: "null", kind: "Identifier" },
            await: true
        };
    }
}