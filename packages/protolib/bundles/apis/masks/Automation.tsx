import { Node, Field, FlowPort, NodeParams, FallbackPort, Button } from 'protoflow';
import { API } from 'protolib'
import { Plug } from 'lucide-react';
import { filterCallback, restoreCallback } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'

const Automation = (node: any = {}, nodeData = {}) => {
    const color = useColorFromPalette(9)
    return (
        <Node icon={Plug} node={node} isPreview={!node?.id} title='Automation' id={node.id} color={color} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Name', static: true, field: 'param-3', type: 'input' }]} />
            <div>
                <FlowPort id={node.id} type='input' label='On run (params)' style={{ top: '130px' }} handleId={'request'} />
                <FallbackPort node={node} port={'param-2'} type={"target"} fallbackPort={'request'} portType={"_"} preText="async (params) => " postText="" />
            </div>

            <Button style={{ marginTop: '60px' }} label="Run" onPress={() => {
                API.get('/api/v1/automations/' + nodeData['param-3'].value)
            }} />
        </Node>
    )
}

export default {
    id: 'Automation',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && nodeData.to == 'context.automation'
            && nodeData["param-2"] && nodeData["param-2"].startsWith
            && (nodeData["param-2"]?.startsWith('async (params) =>') || nodeData["param-2"]?.startsWith('(params) =>'))
        )
    },
    category: "automation",
    keywords: ["automation", 'trigger'],
    getComponent: Automation,
    filterChildren: filterCallback(),
    restoreChildren: restoreCallback(),
    getInitialData: () => {
        return { to: 'context.automation', "param-1": { value: 'app', kind: 'StringLiteral' }, "param-2": { value: 'async (params) =>' }, "param-3": { value: "", kind: "StringLiteral" } }
    }
}