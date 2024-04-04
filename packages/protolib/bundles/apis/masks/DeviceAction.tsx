import { Node, NodeParams, Field } from 'protoflow';
import { useState, useEffect } from 'react';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Play } from 'lucide-react';
import { DeviceRepository } from '../../devices/repositories/deviceRepository';
import { DeviceCollection, DeviceModel } from '../../devices/models/DeviceModel';
import { DeviceDataType, SubsystemType } from '../../devices/models/interfaces';
import { SubsystemCollection, SubsystemModel } from '../../devices/models/SubsystemModel';

const deviceRepository = new DeviceRepository()
const DeviceAction = (node: any = {}, nodeData = {}) => {
    let deviceName = nodeData['param1'];
    let deviceComponent = nodeData['param2'];
    let deviceAction = nodeData['param3'];

    const [devicesData, setDevicesData] = useState<any[]>([]);
    const [payloadVisibility, setPayloadVisibility] = useState(false);
    const color = useColorFromPalette(6)

    const updatePayloadVisibility = async (devicesData) => {
        const subsystem = devicesData.filter(device => device.name === deviceName?.replaceAll('"', ''))[0]?.subsystem
        const actions = subsystem?.filter(subsystem => subsystem.name === deviceComponent.replaceAll('"', ''))[0]?.actions
        const payloadValue = actions?.filter(action => action.name === deviceAction.replaceAll('"', ''))[0]?.payload?.value
        setPayloadVisibility(payloadValue ? true : false)
    }
    
    const getDevices = async () => {
        const { data } = await deviceRepository.list()
        const { items: devices } = data;
        setDevicesData([...devices]);
        updatePayloadVisibility(devices)
    }

    // Device
    const deviceCollection = new DeviceCollection(devicesData);
    const deviceNames = deviceCollection?.getNames(true) ?? [];
    const selectedDevice: DeviceDataType = deviceCollection.findByName(deviceName, true);
    const selectedDeviceModel = new DeviceModel(selectedDevice)
    // Subsystem
    const deviceSubsystems = selectedDeviceModel.getSubsystems()
    const subsystemsCollection = new SubsystemCollection(deviceSubsystems);
    const deviceSubsystemsNames = selectedDeviceModel.getSubsystemNames(true, true) ?? [];
    const selectedSubsystem: SubsystemType = subsystemsCollection.findByName(deviceComponent, true);
    const selectedSubsystemModel = new SubsystemModel(selectedSubsystem)
    // Action
    const subsystemActionNames = selectedSubsystemModel.getActionsNames(true) ?? [];

    const actionPayloadNodeParams: Field[] = [
        {
            label: 'Action payload', field: 'param4', type: 'input', static: true,
        }
    ] as Field[]

    useEffect(() => {
        getDevices()
    }, [])

    useEffect(() => {
        updatePayloadVisibility(devicesData)
    }, [deviceAction])

    return (
        <Node icon={Play} node={node} isPreview={!node.id} title='Device Action' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Device name', field: 'param1', type: 'select', static: true, data: deviceNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Component', field: 'param2', type: 'select', static: true, data: deviceSubsystemsNames }]} />
            <NodeParams id={node.id} params={[{ label: 'Action', field: 'param3', type: 'select', static: true, data: subsystemActionNames }]} />
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
    getInitialData: () => { return { to: 'context.deviceAction', param1: "", param2: "", param3: "", await: true } }
}