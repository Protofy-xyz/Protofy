import { Node, Field, FlowPort, NodeParams, FallbackPort, Button } from 'protoflow';
import { API } from 'protolib'
import DevicePub from 'protolib/bundles/apis/masks/DevicePub';
import React from 'react';
import { useState, useEffect } from 'react';

const TestMask = ({ node = {}, nodeData = {}, children }: any) => {
    return (
        <Node node={node} isPreview={!node.id} title='testCall' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[
                {
                    label: 'Value', 
                    field: 'param1', 
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
    getInitialData: () => { return { to: 'testCall', param1: '"none"', param2: '"none"', param3: '"none"' } }
}