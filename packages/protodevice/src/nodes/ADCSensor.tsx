import React from "react";
import {Node, Field, NodeParams } from 'protoflow';
import { useAppStore } from "../../../../../context/appStore";
import { useDeviceStore } from "../../../store/DeviceStore";
import Text from "../../../../../palettes/uikit/Text";
import { Progress } from 'native-base';
import NodeBus, { cleanName, generateTopic } from "../NodeBus";

const ADCSensor = (node: any = {}, nodeData = {}, children) => {
    const [name,setName] = React.useState(cleanName(nodeData['param1']))
    const nameErrorMsg = 'Reserved name'
    const intervalErrorMsg = 'Add units h/m/s/ms'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param1', type: 'input', onBlur:()=>{setName(cleanName(nodeData['param1']))}, pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str.toLowerCase() + '"',
            error: nodeData['param1']?.replace(/['"]+/g, '') == 'adc' ? nameErrorMsg : null
        },
        {
            label: 'Update Interval', static: true, field: 'param2', type: 'input', pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str + '"',
            error: !['h', 'm', 's', 'ms'].includes(nodeData['param2']?.replace(/['"0-9]+/g, '')) ? intervalErrorMsg : null
        },
        {
            label: 'Attenuation', static: true, field: 'param3', type: 'select',
            data: ['"auto"','"0db"', '"2.5db"', '"6db"', '"11db"']
        }
    ] as Field[]
    // const nodeOutput: Field = { label: 'Input (Pin 32-35)', field: 'value', type: 'output' }
    const currentDevice = useDeviceStore(state => state.electronicDevice);
    const type = 'sensor';
    const mqttTopic = generateTopic(currentDevice,type,name)
    const lastMessages = useAppStore(state => mqttTopic?state.lastMessagesByTopic[mqttTopic]:[]) ?? []
    const[adcValue,setAdcValue] = React.useState(0);
    React.useEffect(()=>{
        setAdcValue((lastMessages.map(m => m.message).reverse()[0]*100/3.3).toFixed(2));
    },[lastMessages])
    return (
        <Node node={node} isPreview={!node.id} title='Analog Sensor' color="#FFCC80" id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
            {/* <HandleOutput id={node.id} param={nodeOutput} /> */}
            <Text marginLeft={4} marginBottom={1} textAlign={"left"} color={isNaN(adcValue) ? "warmGray.300" : "black"}>Voltage: {isNaN(adcValue) ? 'undefined' : (adcValue/100*3.3).toFixed(2)} V</Text>
            <Progress value={adcValue} mx="4" marginBottom="3" />
            <NodeBus componentName={name} type={type}/>
        </Node>
    )
}

export default ADCSensor