import React from "react";
import { Position } from "reactflow";
import { Node, Field, HandleOutput, NodeParams } from '../../flowslib';
import { useDeviceStore } from "../../../store/DeviceStore";
import { useAppStore } from "../../../../../context/appStore";
import { HStack, Text, Icon } from "native-base";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NFCReader = (node:any={}, nodeData={}, children) => {
    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param1', type: 'input', pre:(str) =>str.replace(/['"]+/g, ''), post: (str) => '"'+str.toLowerCase()+'"'},
        { label: 'SclPin', static: true, field: 'param2', type: 'input', pre:(str) =>str.replace(/['"]+/g, ''), post: (str) => '"'+str+'"'}
    ] as Field[]
    const nodeOutput: Field = {label: 'Input (sda)', field: 'value', type: 'output' }
    const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME
    const currentDevice = useDeviceStore(state => state.electronicDevice);
    const mqttTopic = `${projectName}/${currentDevice}/pn532_i2c/${nodeData['param1']?.replace(/['"]+/g, '')}/state`
    const addChannel = useAppStore(state => state.addChannel)
    const lastMessages = useAppStore(state => state.lastMessagesByTopic[mqttTopic]) ?? []
    addChannel(mqttTopic);
    const [detected, setDetected] = React.useState();
    const detectedRef = React.useRef('');
    const timerFunction = ()=>{
        if(detectedRef.current){
            if(detectedRef.current.includes("removed")){
                setDetected('');
            }
        }
    }
    
    React.useEffect(() => {
        detectedRef.current = detected;
      }, [detected]);

    React.useEffect(() => {
        const message = lastMessages.map(m => m.message).reverse()[0]
        var id;
        if(message){
            if(message.includes("not:")){
                setDetected("removed: "+message.split("not:")[1]);
                id = setTimeout(timerFunction,2000);
            }else{
                setDetected(message)
            }
        }
        return () => clearTimeout(id)
    }, [lastMessages])
    return (
        <Node node={node} isPreview={!node.id} title='NFCReader' color="#F06292" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
            <HandleOutput position={Position.Right} id={node.id} param={nodeOutput} />
            <HStack mt="20px" mb="5px" alignItems={'center'}>
                <Text ml={4} textAlign={"left"} color="warmGray.300">TagId detected: </Text>
                <Icon as={MaterialCommunityIcons} color={!detected ? 'error.600' : 'green.600'} name={'circle-medium'} />
            </HStack>
            <HStack mt="5px" mb="10px" alignItems={'center'}>
                <Text ml={4} textAlign={"left"} color={!detected || detected == 'none' ? "warmGray.300" : 'blue.600'}>{detected}</Text>
            </HStack>
        </Node>
    )
}

export default NFCReader
