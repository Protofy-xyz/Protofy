import { Node, getFieldValue, CustomFieldsList } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DeviceCollection, DeviceModel } from '../../devices/models/DeviceModel';
import { DeviceDataType } from '../../devices/models/interfaces';
import { DeviceRepository } from '../../devices/repositories/deviceRepository';
import { DimensionProps, LayoutProps, TextProps } from './PropsLists';

const deviceRepository = new DeviceRepository()

const SensorValueMask = ({ node = {}, nodeData = {} }: any) => {
    const color = useColorFromPalette(55)

    const [devicesData, setDevicesData] = useState<any[]>([]);

    let deviceName = getFieldValue("prop-device", nodeData);;

    const getDevices = async () => {
        const { data } = await deviceRepository.list('dev')
        const { items: devices } = data;
        setDevicesData(devices);
    }

    // Device
    const deviceCollection = new DeviceCollection(devicesData);
    const deviceNames = deviceCollection?.getNames() ?? [];
    const selectedDevice: DeviceDataType = deviceCollection.findByName(deviceName);
    const selectedDeviceModel = new DeviceModel(selectedDevice)
    // Subsystem
    const deviceSubsystemsNames = selectedDeviceModel.getSubsystemNames('monitor') ?? [];

    const propsList = [
        {
            "label": "device",
            "field": "prop-device",
            "staticLabel": true,
            "type": "select",
            "data": deviceNames,
            "section": "device"
        },
        {
            "label": "sensor",
            "field": "prop-sensor",
            "staticLabel": true,
            "type": "select",
            "data": deviceSubsystemsNames,
            "section": "device"
        },
        ...TextProps,
        ...LayoutProps,
        ...DimensionProps
    ]

    useEffect(() => {
        if (node.id) getDevices()
    }, [])

    return (
        <Node
            icon={Timer}
            node={node}
            isPreview={!node.id}
            title='SensorValue' color={color} id={node.id}
            skipCustom={true}
            disableInput
            disableOutput
        >
            <CustomFieldsList node={node} nodeData={nodeData} fields={propsList} />
        </Node >
    )
}

export default {
    id: 'SensorValueMask',
    type: 'JsxElement',
    category: 'UI Elements',
    keywords: ['button', 'ui', 'simple'],
    check: (node, nodeData) => {
        return (
            ["JsxElement", "JsxSelfClosingElement"].includes(node.type) && nodeData.name == 'SensorValue'
        )
    },
    getComponent: (node, nodeData, children) => <SensorValueMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { name: 'SensorValue' } }
}