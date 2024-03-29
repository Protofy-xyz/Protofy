import { Node, Field, FlowPort, NodeParams, FallbackPort, Button } from 'protoflow';
import { API } from 'protolib'
import { Plug } from 'lucide-react';
import { filterCallback, restoreCallback } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'

const Automation = (node: any = {}, nodeData = {}) => {
    const color = useColorFromPalette(9)
    return (
        <Node icon={Plug} node={node} isPreview={!node?.id} title='Automation' id={node.id} color={color} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Name', static: true, field: 'param3', type: 'input', pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str + '"' }]} />
            <div>
                <FlowPort id={node.id} type='input' label='On run (request)' style={{ top: '130px' }} handleId={'request'} />
                <FallbackPort node={node} port={'param2'} type={"target"} fallbackPort={'request'} portType={"_"} preText="async (params) => " postText="" />
            </div>

            <Button style={{marginTop: '60px'}} label="Run" onPress={() => {
                API.get('/api/v1/automations/'+eval(nodeData['param3']))
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
            && (nodeData.param2?.startsWith('async (params) =>') || nodeData.param2?.startsWith('(params) =>'))
            && nodeData.to == 'context.automation'
        )
    },
    getComponent: Automation,
    filterChildren: filterCallback(),
    restoreChildren: restoreCallback(),
    getInitialData: () => { return { to: 'context.automation', param1: 'app', param2: 'async (params) =>', param3: '""' } }
}