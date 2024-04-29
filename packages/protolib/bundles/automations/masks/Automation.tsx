import { Node, NodeOutput, NodeParams, filterObject, restoreObject, getFieldValue, Button } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Plug } from 'lucide-react';
import React from 'react';
import { Spinner, XStack } from 'tamagui';
import { API } from 'protolib'

const AutomationNode = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(9)
    const [loading, setLoading] = React.useState(false)
    return (
        <Node icon={Plug} node={node} isPreview={!node.id} title='Automation' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Name', field: 'mask-name', type: 'input' },
                { label: 'Response', field: 'mask-responseMode', type: 'select', data: ['instant', 'wait', 'manual'], static: true},
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Run'} vars={['params']} handleId={'mask-onRun'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
            <div style={{height: '0px'}} />
            <Button label={<XStack minHeight='30px' ai="center" jc="center">{loading?<Spinner color={color} />:'Run'}</XStack>} onPress={async () => {
                const params = getFieldValue('testparams', nodeData)
                setLoading(true)
                await API.get('/api/v1/automations/' + getFieldValue('param-3', nodeData)+(params ? '?'+params : ''))
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
    id: 'automations.automation',
    type: 'CallExpression',
    category: "automation",
    keywords: ['automation', 'app', 'api'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to == 'context.automations.automation'
    },
    getComponent: (node, nodeData, children) => <AutomationNode node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            name: 'input',
            responseMode: 'input',
            app: 'input',
            onRun: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        name: 'input',
        responseMode: 'input',
        app: 'input',
        onRun: { params: {'param-params': { key: "params"}, 'param-res': { key: "res"}}},
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.automations.automation',
            "param-1": {
                value: "{}",
                kind: "Identifier"
            },
            "mask-name": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-responseMode": {
                value: "wait",
                kind: "StringLiteral"
            },
            "mask-app": {
                value: 'app',
                kind: "Identifier"
            }
        }
    }
}