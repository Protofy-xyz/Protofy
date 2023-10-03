import React from "react";
import { Field, Node, NodeParams } from '../../flowslib';
import { useAppStore } from "../../../../../context/appStore";
import { useDeviceStore } from "../../../store/DeviceStore";
import { HStack, Text, Icon } from "native-base"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NodeBus, { cleanName, generateTopic } from "../NodeBus";


const PIRSensor = (node: any = {}, nodeData = {}, children) => {
    const [name,setName] = React.useState(cleanName(nodeData['param1']))
    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param1', type: 'input', onBlur:()=>{setName(cleanName(nodeData['param1']))}, pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str.toLowerCase() + '"' }
    ] as Field[]
    // const nodeOutput: Field = { label: 'Output', field: 'value', type: 'output' }
    const currentDevice = useDeviceStore(state => state.electronicDevice);
    const type = 'binary_sensor';
    const mqttTopic = generateTopic(currentDevice,type,name)
    const lastMessages = useAppStore(state => mqttTopic?state.lastMessagesByTopic[mqttTopic]:[]) ?? []    
    const [detected, setDetected] = React.useState();
    React.useEffect(() => {
        setDetected(lastMessages.map(m => m.message).reverse()[0]);
    }, [lastMessages])
    return (
        <Node node={node} isPreview={!node.id} title='PIR Sensor' color="#EEEEEE" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
            <HStack mt="20px" mb="10px" alignItems={'center'}>
                <Text ml={4} textAlign={"left"} color="warmGray.300">Movement detected: </Text>
                <Text color={!detected || detected == 'OFF' ? "warmGray.300" : 'blue.600'}>{detected == 'ON' ? 'yes' : detected == 'OFF' ? "no" : 'offline'}</Text>
                <Icon as={MaterialCommunityIcons} color={!detected ? 'error.600' : 'green.600'} name={'circle-medium'} />
            </HStack>
            <NodeBus componentName={name} type={type}/>
        </Node>
    )
}

export default PIRSensor