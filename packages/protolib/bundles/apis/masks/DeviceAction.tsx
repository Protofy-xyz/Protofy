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
    const color = useColorFromPalette(6)

    const getDevices = async () => {
        const { data } = await deviceRepository.list()
        const { items: devices } = data;
        setDevicesData([...devices]);
    }

    // Device
    const deviceCollection = new DeviceCollection(devicesData);
    const deviceNames = devicesData ? deviceCollection?.getNames(true) : ['"none"'];
    const selectedDevice: DeviceDataType = deviceCollection.findByName(deviceName, true);
    const selectedDeviceIndex: number = deviceNames?.indexOf(deviceName) === -1 || !deviceName ? 0 : deviceCollection?.getIndexByName(deviceName)
    const selectedDeviceModel = new DeviceModel(selectedDevice)
    // Subsystem
    const deviceSubsystems = selectedDeviceModel.getSubsystems()
    const subsystemsCollection = new SubsystemCollection(deviceSubsystems);
    const deviceSubsystemsNames = devicesData ? selectedDeviceModel.getSubsystemNames(true, true) : ['"none"']
    const selectedSubsystemIndex = deviceSubsystemsNames?.indexOf(deviceComponent) === -1 ? 0 : deviceSubsystemsNames?.indexOf(deviceComponent);
    const selectedSubsystem: SubsystemType = subsystemsCollection.findByName(deviceComponent, true);
    const selectedSubsystemModel = new SubsystemModel(selectedSubsystem)
    // Action
    const subsystemActionNames = devicesData ? selectedSubsystemModel.getActionsNames(true) : ['"none"']
    const selectedAction = subsystemActionNames.indexOf(deviceAction) === -1 ? 0 : subsystemActionNames?.indexOf(deviceAction)

    const nodeParams: Field[] = [
        {
            label: 'Device name', field: 'param1', type: 'selectWithDefault', static: true,
            selectedIndex: selectedDeviceIndex,
            data: deviceNames,
        },
        {
            label: 'Component', field: 'param2', type: 'selectWithDefault', static: true,
            selectedIndex: selectedSubsystemIndex,
            data: deviceSubsystemsNames
        },
        {
            label: 'Action', field: 'param3', type: 'selectWithDefault', static: true,
            selectedIndex: selectedAction,
            data: subsystemActionNames
        }
    ] as Field[]

    useEffect(() => {
        getDevices()
    }, [])

    return (
        <Node icon={Play} node={node} isPreview={!node.id} title='Device Action' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'DeviceActionnnn',
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