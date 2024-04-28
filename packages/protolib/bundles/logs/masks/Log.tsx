import { Node, NodeOutput, NodeParams, filterObject, restoreObject} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { PencilLine } from 'lucide-react';

const Log = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(22)
    return (
        <Node icon={PencilLine} node={node} isPreview={!node.id} title='Log' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Message', field: 'mask-message', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Data', field: 'mask-data', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Level', field: 'mask-level', type: 'select', data: ['info', 'error', 'warn', 'debug', 'trace', 'fatal'] }]} />

            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'done'} handleId={'mask-done'} />
        </Node>
    )
}

export default {
    id: 'logs.log',
    type: 'CallExpression',
    category: "Logging",
    keywords: ["log", "info", "logger", "logs"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.logs.log')
    },
    getComponent: (node, nodeData, children) => <Log node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            message: 'input',
            data: 'input',
            level: 'input',
            done: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        message: 'input',
        data: 'input',
        level: 'input',
        done: 'output'
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.logs.log',
            "mask-message": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-data": {
                value: "",
                kind: "Identifier"
            },
            "mask-level": {
                value: "info",
                kind: "StringLiteral"
            }
        }
    }
}
