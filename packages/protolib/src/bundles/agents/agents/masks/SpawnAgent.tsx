import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Split } from '@tamagui/lucide-icons';
import { agentBusTypes } from './index';

const SpawnAgent = ({ node = {}, nodeData = {}, children }: any) => {
  const color = useColorFromPalette(10)

  return (
    <Node icon={Split} node={node} isPreview={!node.id} title='Spawn Agent' color={color} id={node.id} skipCustom={true}>
      <p style={{ fontSize: "22px" }}>Client</p>
      <NodeParams id={node.id} params={[{ label: 'Agent name', field: 'mask-agentName', type: 'input' }]} />
      <NodeParams id={node.id} params={[{ label: 'Exposed Subsystems', field: 'mask-subsystems', type: 'input' }]} />
      <div style={{ height: '30px' }} />
      <p style={{ fontSize: "22px" }}>Server</p>
      <NodeParams id={node.id} params={[{ label: 'Host', field: 'mask-host', type: 'input', }]} />
      <NodeParams id={node.id} params={[{ label: 'Host Port', field: 'mask-hostPort', type: 'input', }]} />
      <NodeParams id={node.id} params={[{ label: 'Connection type', field: 'mask-connectionType', type: 'select', data: agentBusTypes }]} />
      <NodeParams id={node.id} params={[{ label: 'Authentication', field: 'mask-auth', type: 'boolean' }]} />
      {
        nodeData["mask-auth"]?.value
          ? <>
            <NodeParams id={node.id} params={[{ label: 'Username', field: 'mask-username', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Password', field: 'mask-password', type: 'input' }]} />
          </>
          : <></>
      }
      <div style={{ height: '30px' }} />
      <p style={{ fontSize: "22px" }}>Handlers</p>
      <NodeOutput id={node.id} type={'input'} label={'On Connect'} vars={[]} handleId={'mask-onConnect'} />
    </Node>
  )
}

export default {
  id: 'agents.spawnAgent',
  type: 'CallExpression',
  category: "Agents",
  keywords: ["Agents", "remote", "connection"],
  check: (node, nodeData) => {
    return node.type == "CallExpression" && nodeData.to?.startsWith('context.agents.spawnAgent')
  },
  getComponent: (node, nodeData, children) => <SpawnAgent node={node} nodeData={nodeData} children={children} />,
  filterChildren: filterObject({
    keys: {
      agentName: 'input',
      connectionType: 'input',
      subsystems: 'input',
      host: 'input',
      hostPort: 'input',
      auth: 'input',
      username: 'input',
      password: 'input',
      onConnect: 'output',
    }
  }),
  restoreChildren: restoreObject({
    keys: {
      agentName: 'input',
      connectionType: 'input',
      subsystems: 'input',
      host: 'input',
      hostPort: 'input',
      auth: 'input',
      username: 'input',
      password: 'input',
      onConnect: {
        params: { 'mask-onConnect': {}, }
      },
    }
  }),
  getInitialData: () => {
    return {
      await: true,
      to: 'context.agents.spawnAgent',
      "mask-agentName": {
        value: "",
        kind: "StringLiteral"
      },
      "mask-subsystems": {
        value: [],
        kind: "Identifier"
      },
      "mask-host": {
        value: "127.0.0.1",
        kind: "StringLiteral"
      },
      "mask-hostPort": {
        value: 1883,
        kind: "Identifier"
      },
      "mask-auth": {
        value: false,
        kind: "Identifier"
      },
    }
  }
}
