import React from "react";
import {Node, Field, HandleOutput, NodeParams } from '../../flowslib';
import { HStack, Text, Icon } from "native-base";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LEDCOutput = (node: any = {}, nodeData = {}, children) => {
    const errorMsg = 'Units should be Hz'
    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param1', type: 'input', pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str.toLowerCase() + '"' },
        {
            label: 'Frequency', static: true, field: 'param2', type: 'input', pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str + '"',
            error: !nodeData['param2']?.replace(/['"0-9]+/g, '').endsWith('Hz') ? errorMsg : null
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='PWM Output' color="#BDAAA4" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
            <HStack mt="20px" mb="10px" alignItems={'center'} justifyContent={"space-between"}>
                <Text ml={3} textAlign={"left"} color="warmGray.300">Pwm controls: </Text>
                <HStack mr={"14px"}>
                    <Icon size={"2xl"} as={MaterialCommunityIcons} color={"black"} name={'plus-circle'}  onPress={()=>console.log("plus")}/>
                    <Icon size={"2xl"} as={MaterialCommunityIcons} color={"black"} name={'minus-circle'} onPress={()=>console.log("minus")}/>
                </HStack>
            </HStack>
        </Node>
    )
}

export default LEDCOutput