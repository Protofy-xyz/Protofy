import { Node, NodeParams } from 'protoflow';
import { useState, useEffect } from 'react';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';
import { DeviceRepository } from '../../devices/repositories/deviceRepository';
import { DeviceCollection, DeviceModel } from '../../devices/models/DeviceModel';
import { DeviceDataType, SubsystemType } from '../../devices/models/interfaces';
import { SubsystemCollection, SubsystemModel } from '../../devices/models/SubsystemModel';


const deviceRepository = new DeviceRepository()
const DeviceMonitor = ({ node = {}, nodeData = {}, children }: any) => {
    let deviceName = nodeData['param1'];
    let deviceComponent = nodeData['param2'];
    let deviceMonitor = nodeData['param3'];

    const color = useColorFromPalette(7)
    const [devicesData, setDevicesData] = useState<any[]>([]);

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
    const deviceSubsystemsNames = selectedDeviceModel.getSubsystemNames('monitor', true) ?? [];
    const selectedSubsystem: SubsystemType = subsystemsCollection.findByName(deviceComponent, true);
    const selectedSubsystemModel = new SubsystemModel(selectedSubsystem)
    // Monitor
    const subsystemMonitorNames = selectedSubsystemModel.getMonitorsNames(true) ?? [];
    // const selectedMonitor = selectedSubsystemModel.getActionByName(deviceMonitor?.replaceAll('"', ''))

    useEffect(() => {
        getDevices()
    }, [])

    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Device Monitor' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Device name', field: 'param1', type: 'select', static: true, data: deviceNames }]} />
            {deviceSubsystemsNames?.length ? <NodeParams id={node.id} params={[{ label: 'Component', field: 'param2', type: 'select', static: true, data: deviceSubsystemsNames }]} /> : null}
            {subsystemMonitorNames?.length ? <NodeParams id={node.id} params={[{ label: 'Monitor', field: 'param3', type: 'select', static: true, data: subsystemMonitorNames }]} /> : null}
        </Node>
    )
}
export default {
    id: 'DeviceMonitor',
    type: 'CallExpression',
    category: "ioT",
    keywords: ["automation", 'esp32', 'device', 'iot', 'trigger'],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('context.deviceMonitor'),
    getComponent: (node, nodeData, children) => <DeviceMonitor node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'context.deviceMonitor', param1: '', param2: '', param3: '', await: true } }
}
