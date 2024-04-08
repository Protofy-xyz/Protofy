import { Node, NodeParams, getFieldValue } from 'protoflow';
import { useState, useEffect } from 'react';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Play } from 'lucide-react';
import { DeviceRepository } from '../../devices/repositories/deviceRepository';
import { DeviceCollection, DeviceModel } from '../../devices/models/DeviceModel';
import { DeviceDataType, SubsystemType } from '../../devices/models/interfaces';
import { SubsystemCollection, SubsystemModel } from '../../devices/models/SubsystemModel';

const deviceRepository = new DeviceRepository()
const DeviceAction = (node: any = {}, nodeData = {}) => {

    let deviceName = getFieldValue("param-1", nodeData);
    let deviceComponent = deviceName ? getFieldValue("param-2", nodeData) : "";
    let deviceAction = deviceName ? getFieldValue("param-3", nodeData) : "";
    const [devicesData, setDevicesData] = useState<any[]>([]);
    const color = useColorFromPalette(6)

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
    const deviceSubsystemsNames = selectedDeviceModel.getSubsystemNames('action') ?? [];
    const selectedSubsystem: SubsystemType = subsystemsCollection.findByName(deviceComponent);
    const selectedSubsystemModel = new SubsystemModel(selectedSubsystem)
    // Action
    const subsystemActionNames = selectedSubsystemModel.getActionsNames() ?? [];
    const selectedAction = selectedSubsystemModel.getActionByName(deviceAction)
    const actionValue = selectedAction?.payload?.value;

    useEffect(() => {
        getDevices()
    }, [])

    return (
        <Node icon={Play} node={node} isPreview={!node.id} title='Device Action' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Device name', field: 'param-1', type: 'select', static: true, data: deviceNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Component', field: 'param-2', type: 'select', static: true, data: deviceSubsystemsNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Action', field: 'param-3', type: 'select', static: true, data: subsystemActionNames }]} />
            {!actionValue && deviceAction && deviceAction !== '' ? <NodeParams id={node.id} params={[{ label: 'Action payload', field: 'param-4', type: 'input', static: true }]} /> : null}
        </Node>
    )
}

export default {
    id: 'DeviceAction',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && (nodeData.to == 'context.deviceAction')
        )
    },
    category: "ioT",
    keywords: ['action', "automation", 'esp32', 'device', 'iot'],
    getComponent: DeviceAction,
    getInitialData: () => { return { to: 'context.deviceAction', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "", kind: "StringLiteral" }, "param-3": { value: "", kind: "StringLiteral" }, "param-4": undefined, await: true } }
}