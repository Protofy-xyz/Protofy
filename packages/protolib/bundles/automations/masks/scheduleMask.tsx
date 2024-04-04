import { Node, FlowPort, NodeParams, FallbackPort, filterCallback, restoreCallback} from 'protoflow';
import {useColorFromPalette} from 'protoflow/src/diagram/Theme'
import { Timer } from 'lucide-react';

const ScheduleMask = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(55)
    return (
        <Node icon={Timer} node={node} isPreview={!node.id} title='Schedule' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Time', field: 'param1', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Day', field: 'param3', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Month', field: 'param4', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Year', field: 'param5', type: 'input' }]} />
            <div style={{ paddingBottom: '80px' }}>
                <FlowPort id={node.id} type='input' label='Execute' style={{ top: '300px' }} handleId={'request'} />
                <FallbackPort node={node} port={'param2'} type={"target"} fallbackPort={'request'} portType={"_"} preText="() =>" postText="" />
            </div>
        </Node>
    )
}

//context, cb, path?, from?

export default {
    id: 'scheduleMask',
    type: 'CallExpression',
    category: 'timers',
    keywords: ['timers', 'event', 'trigger', 'setInterval', 'schedule', 'timer', 'wait', 'sleep'],
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && nodeData.to == 'context.createSchedule'
            && nodeData.param1 && nodeData.param5
            && nodeData.param3 && nodeData.param4
            && nodeData.param2
            && (nodeData.param2?.startsWith('async () =>') || nodeData.param2?.startsWith('() =>'))
        )
    },
    getComponent: (node, nodeData, children) => <ScheduleMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { 
        to: 'context.createSchedule', 
        param1: '"12:30"',
        param2: '() =>', 
        param3: '"5"', 
        param4: '"april"', 
        param5: '"2024"', 
    } },
    filterChildren: filterCallback(),
    restoreChildren: restoreCallback(),
} 

/*
import { Node, Field, FlowPort, NodeParams, FallbackPort, Button } from 'protoflow';
import { API } from 'protolib'
import { Plug } from 'lucide-react';
import { filterCallback, restoreCallback } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'

const Automation = (node: any = {}, nodeData = {}) => {
    const color = useColorFromPalette(9)
    return (
        <Node icon={Plug} node={node} isPreview={!node?.id} title='te volviste un probelma' id={node.id} color={color} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Name', static: true, field: 'param3', type: 'input', pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str + '"' }]} />
            <div>
                <FlowPort id={node.id} type='input' label='On run (params)' style={{ top: '130px' }} handleId={'request'} />
                <FallbackPort node={node} port={'param2'} type={"target"} fallbackPort={'request'} portType={"_"} preText="async (params) => " postText="" />
            </div>

            <Button style={{marginTop: '60px'}} label="Run" onPress={() => {
                API.get('/api/v1/automations/'+eval(nodeData['param3']))
            }} />
        </Node>
    )
}

export default {
    id: 'te volviste un probelma',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && nodeData.to == 'context.automation'
            && nodeData.param2 && nodeData.param2.startsWith
            && (nodeData.param2?.startsWith('async (params) =>') || nodeData.param2?.startsWith('(params) =>'))
        )
    },
    category: "automation",
    keywords: ["automation", 'trigger'],
    getComponent: Automation,
    filterChildren: filterCallback(),
    restoreChildren: restoreCallback(),
    getInitialData: () => { return { to: 'context.automation', param1: 'app', param2: 'async (params) =>', param3: '""' } }
}

*/