import { Node, NodeParams, Field } from 'protoflow';
import { useState, useEffect } from 'react';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Play } from 'lucide-react';
import { DeviceRepository } from '../../devices/repositories/deviceRepository';
import { DeviceCollection } from '../../devices/models/DeviceModel';

const getSubsystemsActions = (devData) => {
    const deviceSubsystemsActions = {};

    devData.forEach(device => {
        const deviceName = '"' + device.name + '"';
        const actions = {};

        device.subsystem?.forEach(subsystem => {
            subsystem.actions?.forEach(action => {
                actions['"' + subsystem.name + '"'] = actions['"' + subsystem.name + '"'] || [];
                actions['"' + subsystem.name + '"'].push('"' + action.name + '"');
            });
        });

        deviceSubsystemsActions[deviceName] = actions;
    });
    return deviceSubsystemsActions

}

const deviceRepository = new DeviceRepository()
const DeviceAction = (node: any = {}, nodeData = {}) => {
    const color = useColorFromPalette(6)
    const [devicesData, setDevicesData] = useState<any[]>([]);
    let deviceName = nodeData['param1'];
    let deviceComponent = nodeData['param2'];
    let deviceAction = nodeData['param3'];

    const getDevices = async () => {
        const { data } = await deviceRepository.list()
        const { items: devices } = data;
        setDevicesData([...devices]);
    }

    useEffect(() => {
        getDevices()
    }, [])

    const deviceCollection = new DeviceCollection(devicesData);
    const subsystems = deviceCollection?.getSubsystemsByDeviceName(true);
    const deviceSubsystems = subsystems[deviceName] ?? [];
    const selectedSubsystem = devicesData ? deviceSubsystems : ['"none"']

    const nodeParams: Field[] = [
        {
            label: 'Device name', field: 'param1', type: 'selectWithDefault', static: true,
            selectedIndex: deviceCollection?.getIndexByName(deviceName) === -1 ? 0 : deviceCollection?.getIndexByName(deviceName),
            data: devicesData ? deviceCollection?.getNames(true) : ['"none"'],
        },
        {
            label: 'Component', field: 'param2', type: 'selectWithDefault', static: true,
            selectedIndex: selectedSubsystem?.indexOf(deviceComponent) ?? 0,
            data: selectedSubsystem
        },
        {
            label: 'Action', field: 'param3', type: 'selectWithDefault', static: true,
            selectedIndex: devicesData && getSubsystemsActions(devicesData)[deviceName] ? getSubsystemsActions(devicesData)[deviceName][deviceComponent]?.indexOf(deviceAction) ?? [] : 0,
            data: devicesData && getSubsystemsActions(devicesData)[deviceName] ? getSubsystemsActions(devicesData)[deviceName][deviceComponent] ?? [] : ['"none"'],
        }
    ] as Field[]


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
    getInitialData: () => { return { to: 'context.deviceAction', param1: "", param2: "", param3: "" } }
}