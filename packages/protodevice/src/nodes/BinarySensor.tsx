import React from "react";
import { Field, Node, NodeParams } from 'protoflow';
import NodeBus, { cleanName, generateTopic } from "../NodeBus";
import { getColor } from ".";

const BinarySensor = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(cleanName(nodeData['param-1']))
    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(cleanName(nodeData['param-1'])) } }
    ] as Field[]
    const type = 'binary_sensor';

    return (
        <Node node={node} isPreview={!node.id} title='Switch' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
            <NodeBus componentName={name} type={type} />
        </Node>
    )
}

export default {
    id: 'BinarySensor',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('binarySensor'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <BinarySensor color={getColor('BinarySensor')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'binarySensor', "param-1": { value: "", kind: "StringLiteral" } } }
}
