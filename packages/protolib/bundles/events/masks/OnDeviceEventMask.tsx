
import { Node, Field, FlowPort, NodeParams, FallbackPort, Button, filterCallback, restoreCallback} from 'protoflow';
import { API } from 'protolib'
import DevicePub from 'protolib/bundles/apis/masks/DevicePub';
import React from 'react';
import { useState, useEffect } from 'react';
import {useColorFromPalette} from 'protoflow/src/diagram/Theme'

const OnDeviceEventMask = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(45)
    return (
        <Node node={node} isPreview={!node.id} title='On Event' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Event Path', field: 'param3', type: 'input' }]} />
            <div style={{height: '20px'}} />
            <div style={{ paddingBottom: "30px" }}>
                <FlowPort id={node.id} type='input' label='On Event (event)' style={{ top: '170px' }} handleId={'request'} />
                <FallbackPort node={node} port={'param2'} type={"target"} fallbackPort={'request'} portType={"_"} preText="(event) => " postText="" />
            </div>
            <div style={{height: '50px'}} />
        </Node>
    )
}

export default {
    id: 'onDeviceEventMask',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'context.onEvent' && nodeData.param4 == '"device"',
    getComponent: (node, nodeData, children) => <OnDeviceEventMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'context.onEvent', param1: 'context', param2: '(event) =>' , param3: '""', param4: '"device"' } },
    filterChildren: filterCallback(),
    restoreChildren: restoreCallback(),
}