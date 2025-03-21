import React, {useContext} from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from ".";
// display:
//   - platform: st7789v
//     model: Custom
//     id: mydisplay
//     backlight_pin: 39
//     cs_pin: 2
//     dc_pin: 40
//     reset_pin: 17
//     width: 240
//     height: 240
//     offset_height: 0
//     offset_width: 0
const ST7789V = ({ node = {}, nodeData = {}, children, color }: any) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports
    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param-1', type: 'input' },
        { label: 'SPI Bus ID', field: 'param-2', type: 'input' },
        {
            label: 'CS pin', static: true, field: 'param-3', type: 'select',
            data: ports.filter(port => port.type.includes('IO')).map(port => port.name)
        },
        {
            label: 'DC pin', static: true, field: 'param-4', type: 'select',
            data: ports.filter(port => port.type.includes('IO')).map(port => port.name)
        },
        {
            label: 'Reset pin', static: true, field: 'param-5', type: 'select',
            data: ports.filter(port => port.type.includes('IO')).map(port => port.name)
        },
        {
            label: 'Backlight pin', static: true, field: 'param-6', type: 'select',
            data: ports.filter(port => port.type.includes('IO')).map(port => port.name)
        },
        { label: 'Width', static: true, field: 'param-7', type: 'input' },
        { label: 'Height', static: true, field: 'param-8', type: 'input' },
        { label: 'Offset Height', static: true, field: 'param-9', type: 'input' },
        { label: 'Offset Width', static: true, field: 'param-10', type: 'input' },
        //fontsize
        { label: 'Font Size', static: true, field: 'param-11', type: 'input' },

    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='ST7789V display' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'ST7789V',
    type: 'CallExpression',
    category: "actuators",
    keywords: ["st7789v", "display"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('st7789v'),
    getComponent: (node, nodeData, children) => <ST7789V color={getColor('ST7789V')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'st7789v', 
        "param-1": { value: "", kind: "StringLiteral" }, 
        "param-2": { value: "myspibus", kind: "StringLiteral" },
        "param-3": { value: "", kind: "NumericLiteral" },
        "param-4": { value: "", kind: "NumericLiteral" },
        "param-5": { value: "", kind: "NumericLiteral" },
        "param-6": { value: "", kind: "NumericLiteral" },
        "param-7": { value: "240", kind: "NumericLiteral" },
        "param-8": { value: "240", kind: "NumericLiteral" },
        "param-9": { value: "0", kind: "NumericLiteral" },
        "param-10": { value: "0", kind: "NumericLiteral" },
        "param-11": { value: "30", kind: "NumericLiteral" },
     } }
}
