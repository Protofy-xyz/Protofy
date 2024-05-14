import React from "react";
import { Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";

const Servo = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name,setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const numberErrorMsg = "Must be a number from 0 to 100"
    const checkNotValidNumber = (number)=>{
        return isNaN(number) || number>100 || number<0;
    }
    const checkValues = (num1,num2,num3) =>{
        return !(num1<=num2 && num2<=num3)
    }
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'servo' ? nameErrorMsg : null
        },
        {
            label: 'Min duty (%)', static: true, field: 'param-2', type: 'input', onBlur: () => { nodeData['param-2'] },
            error: checkNotValidNumber(nodeData['param-2']?.value) ? numberErrorMsg : null
        },
        {
            label: 'Center duty (%)', static: true, field: 'param-3', type: 'input', onBlur: () => { nodeData['param-3'] },
            error: checkNotValidNumber(nodeData['param-3']?.value) ? numberErrorMsg : null
        },
        {
            label: 'Max duty (%)', static: true, field: 'param-4', type: 'input', onBlur: () => { nodeData['param-4'] },
            error: checkNotValidNumber(nodeData['param-4']?.value) ? numberErrorMsg : null
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Servo' color={color} id={node.id} skipCustom={true} >
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'Servo',
    type: 'CallExpression',
    category: "actuators",
    keywords: ["servo", "motor", "servomotor", "pwm", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('servo'),
    getComponent: (node, nodeData, children) => <Servo color={getColor('Servomotor')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { 
        return { 
            to: 'servo', 
            "param-1": { value: "servomot", kind: "StringLiteral" },
            "param-2": { value: 2.5, kind: "NumericLiteral" },
            "param-3": { value: 7.5, kind: "NumericLiteral" },
            "param-4": { value: 12.5, kind: "NumericLiteral" },
        }
    }
}