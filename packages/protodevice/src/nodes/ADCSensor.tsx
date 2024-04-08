import React from "react";
import { Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";
// import { Text, Progress, XStack } from "tamagui";
// import NodeBus, { cleanName, generateTopic } from "../NodeBus";
// import { useDeviceStore } from "../oldThings/DeviceStore";
// import { useSubscription } from "mqtt-react-hooks";

const ADCSensor = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const intervalErrorMsg = 'Add units h/m/s/ms'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'adc' ? nameErrorMsg : null
        },
        {
            label: 'Update Interval', static: true, field: 'param-2', type: 'input',
            error: !['h', 'm', 's', 'ms'].includes(nodeData['param-2']?.value?.replace(/['"0-9]+/g, '')) ? intervalErrorMsg : null
        },
        {
            label: 'Attenuation', static: true, field: 'param-3', type: 'select',
            data: ["auto", "0db", "2.5db", "6db", "11db"]
        }
    ] as Field[]
    // const nodeOutput: Field = { label: 'Input (Pin 32-35)', field: 'value', type: 'output' }
    // const currentDevice = useDeviceStore(state => state.electronicDevice);
    // const type = 'sensor';
    // const mqttTopic = generateTopic(currentDevice,type,name)

    // const[adcValue,setAdcValue] = React.useState(0);
    // const { message }  = useSubscription(mqttTopic)

    // React.useEffect(() => {
    //     setAdcValue(parseFloat(message?.message?.toString())*100/3.3)
    // }, [message])
    return (
        <Node node={node} isPreview={!node.id} title='Analog Sensor' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
            {/* <HandleOutput id={node.id} param={nodeOutput} /> */}
            {/* <XStack>
                
            </XStack> */}
            {/* <Text marginLeft={4} marginBottom={1} textAlign={"left"} color={isNaN(adcValue) ? "warmGray.300" : "black"}>Voltage: {isNaN(adcValue) ? 'undefined' : (adcValue/100*3.3).toFixed(2)} V</Text>
            <Progress value={adcValue} marginHorizontal="4" marginBottom="3" >
                <Progress.Indicator animation="bouncy" />
            </Progress>
            <NodeBus componentName={name} type={type}/> */}
        </Node>
    )
}

export default {
    id: 'ADCSensor',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('adcSensor'),
    getComponent: (node, nodeData, children) => <ADCSensor color={getColor('ADCSensor')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'adcSensor', "param-1": { value: "analogic", kind: "StringLiteral" }, "param-2": { value: "30s", kind: "StringLiteral" }, "param-3": { value: "auto", kind: "StringLiteral" } } }
}