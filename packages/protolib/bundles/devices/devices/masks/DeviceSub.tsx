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
const DeviceSub = ({ node = {}, nodeData = {}, children }: any) => {

    // const [payloadVisibility, setPayloadVisibility] = useState(false);
    let deviceName = getFieldValue("param-3", nodeData);
    let deviceComponent = deviceName ? getFieldValue("param-4", nodeData) : "";
    let deviceMonitor = deviceName ? getFieldValue("param-5", nodeData) : "";

    const color = useColorFromPalette(7)
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
