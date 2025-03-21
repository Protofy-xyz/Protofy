import React from "react";
import { Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";

const NeopixelDisplay = ({ node = {}, nodeData = {}, children, color }: any) => {
    const transitionErrorMsg = 'Add units s/ms'

    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param-1', type: 'input' },
        {
            label: 'Width', static: true, field: 'param-2', type: 'input'
        },
        {
            label: 'Height', static: true, field: 'param-3', type: 'input'
        },        {
            label: 'RGB Order', static: true, field: 'param-4', type: 'select',
            data: ["GRB", "GBR", "BGR", "BRG", "RGB", "RBG", "GRBW", "GBRW", "BGRW", "BRGW", "RGBW", "RBGW"]
        },
        {
            label: 'Chipset', static: true, field: 'param-5', type: 'select',
            data: ["800KBPS", "400KBPS", "400KBPS", "WS2811", "WS2812X", "WS2812", "SK6812", "TM1814", "TM1829", "TM1914", "APA106", "LC8812"]
        },
        {
            label: 'Restore Mode', static: true, field: 'param-6', type: 'select',
            data: ["RESTORE_DEFAULT_OFF", "RESTORE_DEFAULT_ON", "RESTORE_INVERTED_DEFAULT_OFF", "RESTORE_INVERTED_DEFAULT_ON", "RESTORE_AND_OFF", "RESTORE_AND_ON", "ALWAYS_OFF", "ALWAYS_ON"]
        },
        {
            label: 'Channel', static: true, field: 'param-7', type: 'select',
            data: ['0', '1', '2', '3', '4', '5', '6', '7']
        },

    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Neopixel display' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'NeopixelDisplay',
    type: 'CallExpression',
    category: "actuators",
    keywords: ["neopixel","light", "bus","led","800KBPS", "400KBPS", "400KBPS", "WS2811", "WS2812X", "WS2812", "SK6812", "TM1814", "TM1829", "TM1914", "APA106", "LC8812", "RGB", "RGBW","color", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('neopixelDisplay'),
    getComponent: (node, nodeData, children) => <NeopixelDisplay color={getColor('NeopixelDisplay')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'neopixelDisplay', 
        "param-1": { value: "", kind: "StringLiteral" }, 
        "param-2": { value: "8", kind: "StringLiteral" },
        "param-3": { value: "8", kind: "StringLiteral" },
        "param-4": { value: "GRB", kind: "StringLiteral" },
        "param-5": { value: "WS2811", kind: "StringLiteral" }, 
        "param-6": { value: "ALWAYS_ON", kind: "StringLiteral" }, 
        "param-7": { value: "0", kind: "StringLiteral" }, 

     } }
}
