import { Node, getFieldValue, FlowPort, NodeParams, FallbackPort, Button, filterCallback, restoreCallback } from 'protoflow';
import { API } from 'protobase'
import { Plug } from 'lucide-react';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import React from 'react';
import { Spinner, XStack } from 'tamagui';
import { SiteConfig} from 'app/conf'

const Automation = (node: any = {}, nodeData = {}) => {
    const color = useColorFromPalette(9)
    const [loading, setLoading] = React.useState(false)
    
    return (
        <Node icon={Plug} node={node} isPreview={!node?.id} title='Automation' id={node.id} color={color} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Name', static: true, field: 'param-3', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Manual response', field: 'param-4', type: 'boolean', static: true }]} />
            <div style={{marginTop: '20px'}}>
                <FlowPort id={node.id} type='input' label='On run (params)' style={{ top: '200px' }} handleId={'request'} />
                <FallbackPort node={node} fallbackText={'null'} port={'param-2'} type={"target"} fallbackPort={'request'} portType={"_"} preText="async (params, res) => " postText="" />
            </div>
            <div style={{height: '80px'}} />
            <Button label={<XStack minHeight='30px' ai="center" jc="center">{loading?<Spinner color={color} />:'Run'}</XStack>} onPress={async () => {
                const params = getFieldValue('testparams', nodeData)
                setLoading(true)
                await API.get(SiteConfig.getDevelopmentURL('/api/v1/automations/' + getFieldValue('param-3', nodeData)+(params ? '?'+params : '')))
                setLoading(false)
            }}>
            </Button>
            <div style={{height: '0px'}} />
            <NodeParams id={node.id} params={[{ label: 'Params', static: true, field: 'testparams', type: 'input' }]} />
            <div style={{height: '20px'}} />
        </Node>
    )
}

export default {
    id: 'Automation',
    type: 'CallExpression',
    hidden: true,
    check: (node, nodeData) => {
        var param2Val = getFieldValue('param-2', nodeData)
        return (
            node.type == "CallExpression"
            && nodeData.to == 'context.automation'
        )
    },
    category: "automation",
    keywords: ["automation", 'trigger'],
    getComponent: Automation,
    filterChildren: filterCallback('2'),
    restoreChildren: restoreCallback('2'),
    getInitialData: () => {
        return {
            to: 'context.automation',
            "param-1": { value: 'app', kind: 'Identifier' },
            "param-2": { value: 'null', kind: 'Identifier' },
            "param-3": { value: "", kind: "StringLiteral" },
            "param-4": { value: "false", kind: "FalseKeyword"}
        }
    }
}