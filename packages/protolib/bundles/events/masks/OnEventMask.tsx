import { Node, Field, FlowPort, NodeParams, FallbackPort, Button, filterCallback, restoreCallback} from 'protoflow';
import { API } from 'protolib'
import DevicePub from 'protolib/bundles/apis/masks/DevicePub';
import React from 'react';
import { useState, useEffect } from 'react';

const OnEventMask = ({ node = {}, nodeData = {}, children }: any) => {
    return (
        <Node node={node} isPreview={!node.id} title='On Event' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Event Path', field: 'param3', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'From', field: 'param4', type: 'input' }]} />
            <div style={{ paddingBottom: "30px" }}>
                <FlowPort id={node.id} type='input' label='On Event (event)' style={{ top: '170px' }} handleId={'request'} />
                <FallbackPort node={node} port={'param2'} type={"target"} fallbackPort={'request'} portType={"_"} preText="(event) => " postText="" />
            </div>
        </Node>
    )
}

//context, cb, path?, from?

export default {
    id: 'onEventMask',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'context.onEvent' && nodeData.param4 != '"device"' && nodeData.param4 != "'device'",
    getComponent: (node, nodeData, children) => <OnEventMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'context.onEvent', param1: 'context', param2: '(event) =>' , param3: '""', param4: '"device"' } },
    filterChildren: filterCallback(),
    restoreChildren: restoreCallback(),
}