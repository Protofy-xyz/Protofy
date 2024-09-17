import React from "react";
import { Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";

const LEDCOutput = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'

    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'LEDCOutput' ? nameErrorMsg : null
        },
        {
            label: 'Frequency', static: true, field: 'param-2', type: 'select', onBlur: () => { nodeData['param-2'] },
            data: ["1220Hz", "2441Hz", "4882Hz", "9765Hz", "19531Hz"],
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='PWM output' color={color} id={node.id} skipCustom={true} >
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'LEDCOutput',
    type: 'CallExpression',
    category: "actuators",
    keywords: ["LEDCOutput", "motor", "pwm", "device", "output"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('ledcOutput'),
    getComponent: (node, nodeData, children) => <LEDCOutput color={getColor('LEDCOutput')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => {
        return {
            to: 'ledcOutput',
            "param-1": { value: "", kind: "StringLiteral" }, ///DESPLEGABLE FREUQENCIAS
            "param-2": { value: '50 Hz', kind: "StringLiteral" },
        }
    }
}