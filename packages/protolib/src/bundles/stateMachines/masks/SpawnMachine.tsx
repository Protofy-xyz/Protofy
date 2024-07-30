import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes, filterObject, restoreObject} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Split } from '@tamagui/lucide-icons';
import { filterCallback, restoreCallback } from 'protoflow';
import { useEffect, useState } from 'react';
import { SMDefinitionsRepository } from '../repository';

const SpawnMachine = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(10)

    const [machineDefinitions, setMachineDefinitions] = useState<any>([])
    const getMachinesDefinitions = async () => {
      const machines = await SMDefinitionsRepository.list()
      setMachineDefinitions(machines.map(machine => machine['name']))
    }

    useEffect(() => {
      getMachinesDefinitions()
    }, [])
    /*
        definitionName: string, 
    instanceName: string, 
    doneCb?: (result) => void, 
    errorCb?: (err) => void
    */
    return (
        <Node icon={Split} node={node} isPreview={!node.id} title='New State Machine' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Definition name', field: 'mask-definitionName', type: 'select', data: machineDefinitions }]} />
            <NodeParams id={node.id} params={[{ label: 'Instance name', field: 'mask-instanceName', type: 'input' }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['result']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'sm.spawnMachine',
    type: 'CallExpression',
    category: "StateMachines",
    keywords: ["machine", "state machine", "state", "spawn"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.sm.spawnStateMachine')
    },
    getComponent: (node, nodeData, children) => <SpawnMachine node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            definitionName: 'input', 
            instanceName: 'input', 
            done: 'output',
            error: 'output',
    }}),
    restoreChildren: restoreObject({keys: {
        definitionName: 'input',
        instanceName: 'input',
        done: { params: { 'param-done': { key: "result"}, 'param-output': { key: "output"}}}, 
        error: { params: { 'param-error': { key: "err"}, 'param-output': { key: "output"}}},
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.sm.spawnStateMachine',
            "mask-definitionName": {
                value: "",
                kind: "StringLiteral"
            }, 
            "mask-instanceName": {
              value: "",
              kind: "StringLiteral"
          }
        }
    }
}
