import { Node, NodeParams, FlowPort, FallbackPort } from 'protoflow';
import { useState, useEffect } from 'react';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';
import { filterCallback, restoreCallback } from 'protoflow';
import { DeviceRepository } from '../../repositories/deviceRepository';
import { DeviceCollection, DeviceModel } from '../../models/DeviceModel';
import { DeviceDataType, SubsystemType } from '../../models/interfaces';
import { SubsystemCollection, SubsystemModel } from '../../models/SubsystemModel';


const deviceRepository = new DeviceRepository()
const DeviceSub = ({ node = {}, nodeData = {}, children }: any) => {

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
        <Node icon={Cable} node={node} isPreview={!node.id} title='Device Subscribe' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Device name', field: 'param1', type: 'select', static: true, data: deviceNames }]} />
            {deviceSubsystemsNames?.length ? <NodeParams id={node.id} params={[{ label: 'Component', field: 'param2', type: 'select', static: true, data: deviceSubsystemsNames }]} /> : null}
            {subsystemMonitorNames?.length ? <NodeParams id={node.id} params={[{ label: 'Monitor', field: 'param3', type: 'select', static: true, data: subsystemMonitorNames }]} /> : null}
            {
                (deviceName && deviceComponent && deviceMonitor) ?
                    <div style={{ marginTop: "35px" }}>
                        <FlowPort id={node.id} type='output' label='On (message, topic)' style={{ top: '225px' }} handleId={'request'} />
                        <FallbackPort node={node} port={'param4'} type={"target"} fallbackPort={'request'} portType={"_"} preText="(message,topic) => " postText="" />
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
    getComponent: (node, nodeData, children) => <DeviceSub node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterCallback("4"),
    restoreChildren: restoreCallback("4"),
    getInitialData: () => { return { to: 'context.deviceSub', param1: '', param2: '', param3: '', param4: '(message,topic) =>' } }
}
