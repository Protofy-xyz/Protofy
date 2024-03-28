import { Node, Field, FlowPort, NodeParams, FallbackPort, Button } from 'protoflow';
import { API } from 'protolib'
import { Plug } from 'lucide-react';

const ApiMask = (node: any = {}, nodeData = {}) => {
  const nodeParams: Field[] = [{ label: 'Type', field: 'to', type: 'select', data: ['app.get', 'app.post'], static: true }]
  return (
    <Node icon={Plug} node={node} isPreview={!node?.id} title='Api Endpoint' id={node.id} color="#A5D6A7" skipCustom={true}>
      <NodeParams id={node.id} params={nodeParams} />
      <NodeParams id={node.id} params={[{ label: 'Path', field: 'param1', type: 'input' }]} />
      <div style={{ paddingBottom: "30px" }}>
        <FlowPort id={node.id} type='input' label='On Request (req, res)' style={{ top: '170px' }} handleId={'request'} />
        <FallbackPort node={node} port={'param2'} type={"target"} fallbackPort={'request'} portType={"_"} preText="(req, res) => " postText="" />
      </div>

      {nodeData && nodeData['to'] == 'app.get' && <Button label="Make request" onPress={() => {
        API.get(eval(nodeData['param1']))
      }} />}
    </Node>
  )
}

export default ApiMask