import { Node, Field, NodeParams } from 'protoflow';
import { getColor } from '.';
// import subsystem from "./utils/subsystem";

const GPIOSwitch = ({ node = {}, nodeData = {}, children, color }: any) => {

    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param-1', type: 'input' },
        { label: 'Restore Mode', static: true, field: 'param-2', type: 'select', data: ["ALWAYS_ON", "ALWAYS_OFF"] }
    ] as Field[]

    return (
        <Node node={node} isPreview={!node.id} title='GPIO Switch' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
            {/* <div style={{marginTop: "10px", marginBottom: "10px"}}>
                {subsystem(subsystemData, nodeData, type)}
            </div> */}
        </Node>
    )
}

export default {
    id: 'GPIOSwitch',
    type: 'CallExpression',
    keywords: ["gpio", "button", "gpio", "device", "switch"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('GPIOSwitch'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <GPIOSwitch color={getColor('GPIOSwitch')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'GPIOSwitch', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "ALWAYS_OFF", kind: "StringLiteral" } } }
}