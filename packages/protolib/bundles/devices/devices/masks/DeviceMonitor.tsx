import { Node, NodeParams, getFieldValue } from 'protoflow';
import { useState, useEffect } from 'react';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';
import { DeviceRepository } from '../../repositories/deviceRepository';
import { DeviceCollection, DeviceModel } from '../../models/DeviceModel';
import { DeviceDataType, SubsystemType } from '../../models/interfaces';
import { SubsystemCollection, SubsystemModel } from '../../models/SubsystemModel';


const deviceRepository = new DeviceRepository()
const DeviceMonitor = ({ node = {}, nodeData = {}, children }: any) => {
    let deviceName = getFieldValue("param-1", nodeData);
    let deviceComponent = deviceName ? getFieldValue("param-2", nodeData) : "";
    let deviceMonitor = deviceName ? getFieldValue("param-3", nodeData) : "";

    const [devicesData, setDevicesData] = useState<any[]>([]);
    const color = useColorFromPalette(7)

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
    const deviceSubsystemsNames = selectedDeviceModel.getSubsystemNames('monitor') ?? [];
    const selectedSubsystem: SubsystemType = subsystemsCollection.findByName(deviceComponent);
    const selectedSubsystemModel = new SubsystemModel(selectedSubsystem)
    // Monitor
    const subsystemMonitorNames = selectedSubsystemModel.getMonitorsNames() ?? [];
    // const selectedMonitor = selectedSubsystemModel.getActionByName(deviceMonitor?.replaceAll('"', ''))

    useEffect(() => {
        if(node.id) getDevices()
    }, [])

    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Read Sensor' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Device name', field: 'param-1', type: 'select', static: true, data: deviceNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Component', field: 'param-2', type: 'select', static: true, data: deviceSubsystemsNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Monitor', field: 'param-3', type: 'select', static: true, data: subsystemMonitorNames }]} />
        </Node>
    )
}
export default {
    id: 'deviceMonitor',
    type: 'CallExpression',
    category: "ioT",
    keywords: ["automation", 'esp32', 'device', 'iot', 'read sensor', 'read', 'sensor', 'value'],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('context.deviceMonitor'),
    getComponent: (node, nodeData, children) => <DeviceMonitor node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'context.deviceMonitor', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "", kind: "StringLiteral" }, "param-3": { value: "", kind: "StringLiteral" }, await: true } }
}
