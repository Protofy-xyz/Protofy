import { Node, NodeParams } from 'protoflow';
import { useState, useEffect } from 'react';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Play } from 'lucide-react';
import { DeviceRepository } from '../../repositories/deviceRepository';
import { DeviceCollection, DeviceModel } from '../../models/DeviceModel';
import { DeviceDataType, SubsystemType } from '../../models/interfaces';
import { SubsystemCollection, SubsystemModel } from '../../models/SubsystemModel';

const deviceRepository = new DeviceRepository()
const DevicePub = ({ node = {}, nodeData = {}, children }: any) => {
    let deviceName = nodeData['param1'];
    let deviceComponent = nodeData['param2'];
    let deviceAction = nodeData['param3'];

    const [devicesData, setDevicesData] = useState<any[]>([]);
    const color = useColorFromPalette(6)

    const getDevices = async () => {
        const { data } = await deviceRepository.list()
        const { items: devices } = data;
        setDevicesData([...devices]);
    }

    // Device
    const deviceCollection = new DeviceCollection(devicesData);
    const deviceNames = deviceCollection?.getNames(true) ?? [];
    const selectedDevice: DeviceDataType = deviceCollection.findByName(deviceName, true);
    const selectedDeviceModel = new DeviceModel(selectedDevice)
    // Subsystem
    const deviceSubsystems = selectedDeviceModel.getSubsystems()
    const subsystemsCollection = new SubsystemCollection(deviceSubsystems);
    const deviceSubsystemsNames = selectedDeviceModel.getSubsystemNames('action', true) ?? [];
    const selectedSubsystem: SubsystemType = subsystemsCollection.findByName(deviceComponent, true);
    const selectedSubsystemModel = new SubsystemModel(selectedSubsystem)
    // Action
    const subsystemActionNames = selectedSubsystemModel.getActionsNames(true) ?? [];
    const selectedAction = selectedSubsystemModel.getActionByName(deviceAction?.replaceAll('"', ''))
    const actionValue = selectedAction?.payload?.value;

    useEffect(() => {
        getDevices()
    }, [])

    return (
        <Node icon={Play} node={node} isPreview={!node.id} title='Device Publish' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Device name', field: 'param1', type: 'select', static: true, data: deviceNames }]} />
            {deviceSubsystemsNames?.length ? <NodeParams id={node.id} params={[{ label: 'Component', field: 'param2', type: 'select', static: true, data: deviceSubsystemsNames }]} /> : null}
            {subsystemActionNames?.length ? <NodeParams id={node.id} params={[{ label: 'Action', field: 'param3', type: 'select', static: true, data: subsystemActionNames }]} /> : null}
            {!actionValue && deviceAction ?<NodeParams id={node.id} params={[{ label: 'Action payload', field: 'param4', type: 'input', static: true }]} /> : null }
        </Node>
    )
}
export default {
    id: 'devicePub',
    type: 'CallExpression',
    category: "ioT",
    keywords: ["automation", 'esp32', 'device', 'iot'],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('context.devicePub'),
    getComponent: (node, nodeData, children) => <DevicePub node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'context.devicePub', param1: "", param2: "", param3: "", param4: "" } }
}