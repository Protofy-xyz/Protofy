import { Node, getFieldValue, CustomFieldsList } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DeviceCollection } from '../../devices/models/DeviceModel';
import { DimensionProps, LayoutProps, TextProps } from './PropsLists';
import { getDevices } from '../../devices/devicesUtils';

const SensorValueMask = ({ node = {}, nodeData = {} }: any) => {
    const color = useColorFromPalette(55)

    const [devicesData, setDevicesData] = useState<any[]>([]);

    let deviceName = getFieldValue("prop-device", nodeData);;

    const deviceCollection = new DeviceCollection(devicesData);

    const deviceNames = deviceCollection?.getNames() ?? [];
    const deviceSubsystemsNames = deviceCollection?.getSubsystemsNames(deviceName, "monitor") ?? [];

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
        const updateDevices = async () => {
            const devices = await getDevices();
            setDevicesData(devices);
        }

        if (node.id) {
            updateDevices()
        }
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