import React from "react";
import { Node, Field, HandleOutput, NodeParams } from "protoflow";
import { getColor } from ".";

const SntpTime = ({ node = {}, nodeData = {}, children, color }: any) => {
    const nameErrorMsg = 'Reserved name'
    const [name, setName] = React.useState(nodeData['param-1'])
    const tzErrorMsg = 'Invalid timezone. (Continent/City)'

    const isValidTimeZone = (tz) => {
        try {
            Intl.DateTimeFormat(undefined, { timeZone: tz });
            return true;
        } catch (ex) {
            return false; // Invalid time zone
        }
    };

    const nodeParams: Field[] = [
        {
            label: 'Id', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'sntp' ? nameErrorMsg : null
        },
        {
            label: 'Timezone', static: true, field: 'param-2', type: 'input',
            error: !isValidTimeZone(nodeData['param-2']?.value?.replace(/['"]+/g, ''))
                ? tzErrorMsg
                : null
        },


    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='SNTP Time' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'SntpTime',
    type: 'CallExpression',
    category: "Utils",
    keywords: ["time", "sntp"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('sntpTime'),
    getComponent: (node, nodeData, children) => <SntpTime color={getColor('SntpTime')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'sntpTime', 
        "param-1": { value: "", kind: "StringLiteral" },
        "param-2": { value: "Europe/Madrid", kind: "StringLiteral" },
     } }
}
