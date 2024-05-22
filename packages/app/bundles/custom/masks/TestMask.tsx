import { Node, NodeParams } from 'protoflow';
import React from 'react';

const TestMask = ({ node = {}, nodeData = {}, children }: any) => {
    return (
        <Node node={node} isPreview={!node.id} title='testCall' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[
                {
                    label: 'Value', 
                    field: 'param-1', 
                    type: 'range', 
                    static: true,
                    data: {},
                }]} />
        </Node>
    )
}

export default {
    id: 'testCall',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('testCall'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <TestMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'testCall', "param-1": '"none"', "param-2": '"none"', "param-3": '"none"' } }
}