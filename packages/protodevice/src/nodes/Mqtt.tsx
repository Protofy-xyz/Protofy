import { Node, Field, HandleOutput, NodeParams } from 'protoflow';
import { getColor } from '.';

const Mqtt = ({node= {}, nodeData= {}, children, color}: any) => {

    const nodeParams: Field[] = [
        { label: 'Broker', field: 'param-1', type: 'input', static: true },
        { label: 'Port', field: 'param-2', type: 'input', static: true },
    ] as Field[]
    
    return (
        <Node node={node} isPreview={!node.id} title='Mqtt' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default   {
    id: 'Mqtt',
    type: 'CallExpression',
    category: "connectivity",
    keywords: ["mqtt", "bus","mosquitto", "internet", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('mqtt'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <Mqtt color={getColor('Mqtt')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'mqtt', "param-1": { value: "BROKERADDRESS", kind: "StringLiteral" }, "param-2": { value: "1883", kind: "StringLiteral" } } }
  }