import React from "react";
import { Node, Field, HandleOutput, NodeParams } from "protoflow";
import { getColor } from ".";

const SdOfflineLogger = ({ node = {}, nodeData = {}, children, color }: any) => {
    const nameErrorMsg = 'Reserved name'
    const [name, setName] = React.useState(nodeData['param-1'])
    const intervalErrorMsg = 'Add units h/m/s/ms'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'sd_card_component' ? nameErrorMsg : null
        },
        { label: 'Time ID', static: true, field: 'param-2', type: 'input', },
        { label: 'JSON File Name', static: true, field: 'param-3', type: 'input' },
        { 
            label: 'Interval Seconds', static: true, field: 'param-4', type: 'input',
            error: !['h', 'm', 's', 'ms'].includes(nodeData['param-4']?.value?.replace(/['"0-9]+/g, '')) ? intervalErrorMsg : null
        },
        { label: 'Publish Data When Online', static: true, field: 'param-5', type: 'boolean' },
        { label: 'Publish Data Topic', static: true, field: 'param-6', type: 'input' },

    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='SD offline logger' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'SdOfflineLogger',
    type: 'CallExpression',
    category: "Utils",
    keywords: ["sd", "log", "offline"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('sdOfflineLogger'),
    getComponent: (node, nodeData, children) => <SdOfflineLogger color={getColor('SdOfflineLogger')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'sdOfflineLogger', 
        "param-1": { value: "", kind: "StringLiteral" },
        "param-2": { value: "", kind: "StringLiteral" },
        "param-3": { value: "/offline_data.json", kind: "StringLiteral" },
        "param-4": { value: "30s", kind: "StringLiteral" },
        "param-5": { value: true, kind: "FalseKeyword" },
        "param-6": { value: "/ofline_data", kind: "StringLiteral" },
     } }
}
