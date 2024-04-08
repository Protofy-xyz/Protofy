import React from "react";
import { Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";

const NeopixelsBus = ({ node = {}, nodeData = {}, children, color }: any) => {
    const transitionErrorMsg = 'Add units s/ms'

    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param-1', type: 'input' },
        { label: '#LEDS', static: true, field: 'param-2', type: 'input' },
        {
            label: 'RGB Order', static: true, field: 'param-3', type: 'select',
            data: ["GRB", "GBR", "BGR", "BRG", "RGB", "RBG", "GRBW", "GBRW", "BGRW", "BRGW", "RGBW", "RBGW"]
        },
        {
            label: 'Chipset', static: true, field: 'param-4', type: 'select',
            data: ["800KBPS", "400KBPS", "400KBPS", "WS2811", "WS2812X", "WS2812", "SK6812", "TM1814", "TM1829", "TM1914", "APA106", "LC8812"]
        },
        {
            label: 'Restore Mode', static: true, field: 'param-5', type: 'select',
            data: ["RESTORE_DEFAULT_OFF", "RESTORE_DEFAULT_ON", "RESTORE_INVERTED_DEFAULT_OFF", "RESTORE_INVERTED_DEFAULT_ON", "RESTORE_AND_OFF", "RESTORE_AND_ON", "ALWAYS_OFF", "ALWAYS_ON"]
        },
        {
            label: 'Default transition', static: true, field: 'param-6', type: 'input',
            error: !['s', 'ms'].includes(nodeData['param-6']?.value?.replace(/['"0-9]+/g, '')) ? transitionErrorMsg : null
        },
        {
            label: 'Channel', static: true, field: 'param-7', type: 'select',
            data: ['0', '1', '2', '3', '4', '5', '6', '7']
        },
        {
            label: 'Pulse', static: true, field: 'param-8', type: 'boolean'
        },
        {
            label: 'Random', static: true, field: 'param-9', type: 'boolean'
        },
        {
            label: 'Strobe', static: true, field: 'param-10', type: 'boolean'
        },
        {
            label: 'Flicker', static: true, field: 'param-11', type: 'boolean'
        },
        {
            label: 'Adressable Rainbow', static: true, field: 'param-12', type: 'boolean'
        },
        {
            label: 'Adressable Color Wipe', static: true, field: 'param-13', type: 'boolean'
        },
        {
            label: 'Adressable Scan', static: true, field: 'param-14', type: 'boolean'
        },
        {
            label: 'Adressable Twinkle', static: true, field: 'param-15', type: 'boolean'
        },
        {
            label: 'Adressable Random Twinkle', static: true, field: 'param-16', type: 'boolean'
        },
        {
            label: 'Adressable Fireworks', static: true, field: 'param-17', type: 'boolean'
        },
        {
            label: 'Adressable Flicker', static: true, field: 'param-18', type: 'boolean'
        },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Neopixels' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'NeopixelsBus',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('neopixelsBus'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <NeopixelsBus color={getColor('NeopixelsBus')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'neopixelsBus', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "16", kind: "StringLiteral" }, "param-3": { value: "GRB", kind: "StringLiteral" }, "param-4": { value: "WS2811", kind: "StringLiteral" }, "param-5": { value: "ALWAYS_ON", kind: "StringLiteral" }, "param-6": { value: "1s", kind: "StringLiteral" }, "param-7": { value: "0", kind: "StringLiteral" }, "param-8": { value: false, kind: "FalseKeyword" }, "param-9": { value: false, kind: "FalseKeyword" }, "param-10": { value: false, kind: "FalseKeyword" }, "param-11": { value: false, kind: "FalseKeyword" }, "param-12": { value: false, kind: "FalseKeyword" }, "param-13": { value: false, kind: "FalseKeyword" }, "param-14": { value: false, kind: "FalseKeyword" }, "param-15": { value: false, kind: "FalseKeyword" }, "param-16": { value: false, kind: "FalseKeyword" }, "param-17": { value: false, kind: "FalseKeyword" }, "param-18": { value: false, kind: "FalseKeyword" } } }
}
