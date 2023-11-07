import React from "react";
import { Field, Node, NodeParams } from 'protoflow';
import { XStack, Text } from "tamagui";
import { useSubscription  } from 'mqtt-react-hooks';
import NodeBus, { cleanName, generateTopic } from "../NodeBus";
import { useDeviceStore } from "../oldThings/DeviceStore";

const BinarySensor = (node:any={}, nodeData={}, children) => {
    const [name,setName] = React.useState(cleanName(nodeData['param1']))
    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param1', type: 'input', onBlur:()=>{setName(cleanName(nodeData['param1']))}}
    ] as Field[]

    const currentDevice = useDeviceStore(state => state.electronicDevice);
    const type = 'binary_sensor';
    const mqttTopic = generateTopic(currentDevice,type,name)

    const [detected, setDetected] = React.useState('');
    const { message } = useSubscription(mqttTopic)
    
    React.useEffect(() => {
        setDetected(message?.message?.toString())
    }, [message])
    return (
        <Node node={node} isPreview={!node.id} title='Button' color="#A5D6A7" id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
            <XStack mt="20px" mb="10px" alignItems={'center'}>
                <Text ml={4} textAlign={"left"} color="warmGray.300">Push detected: </Text>
                <Text color={!detected || detected == 'OFF' ? "warmGray.300" : 'blue.600'}>{detected == 'ON' ? 'yes' : detected == 'OFF' ? "no" : 'offline'}</Text>
            </XStack>
            <NodeBus componentName={name} type={type}/>
        </Node>
    )
}

export default BinarySensor
