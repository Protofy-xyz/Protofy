import React from "react";
import { Node, Field, HandleOutput, NodeParams } from '../../flowslib';
import { useAppStore } from "../../../../../context/appStore";
import { useDeviceStore } from "../../../store/DeviceStore";
import Text from "../../../../../palettes/uikit/Text";
import { Progress, Flex, HStack } from 'native-base';
import NodeBus, { cleanName, generateTopic } from "../NodeBus";


const CapacitiveSoilMoistureSensor = (node: any = {}, nodeData = {}, children) => {
    const currentDevice = useDeviceStore(state => state.electronicDevice);
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
        }
    ] as Field[]
    const nodeOutput: Field = { label: 'Input (Pin 32-35)', field: 'value', type: 'output' }
    //const name = cleanName(nodeData['param1'])
    const type = 'sensor';
    const mqttTopic = generateTopic(currentDevice,type,name)
    const lastMessages = useAppStore(state => mqttTopic?state.lastMessagesByTopic[mqttTopic]:[]) ?? []
    const [adcValue, setAdcValue] = React.useState(0);
    // React.useEffect(()=>{

    // },name)
    React.useEffect(() => {
        setAdcValue((100-(lastMessages.map(m => m.message).reverse()[0] * 100 / 3.3)).toFixed(2));
    }, [lastMessages])
    return (
        <Node node={node} isPreview={!node.id} title='Capacitive Soil Moisture Sensor' color="#E47473" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
            <HStack mt="20px">
                <Text ml={4} mb={1} textAlign={"left"} color="warmGray.300">Wet ratio: </Text><Text color={isNaN(adcValue) ? "warmGray.300" : "black"}>{isNaN(adcValue) ? 'undefined' : adcValue} %</Text>
            </HStack>
            <Flex direction="row" alignItems="center" px={4} mb="10px">
                <Text color="warmGray.300" textAlign="center">Dry</Text>
                <Progress flex={1} value={adcValue} mx="4" colorScheme="blue" />
                <Text color="warmGray.300">Wet</Text>
            </Flex>
            <NodeBus componentName={name} type={type} />
        </Node>
    )
}

export default CapacitiveSoilMoistureSensor