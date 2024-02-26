import { Node, Field, FlowPort, NodeParams } from 'protoflow';
import { FallbackPort } from 'protoflow';

const ApiMask = (node: any = {}, nodeData = {}) => {
    const nodeParams: Field[] = [{ label: 'Type', field: 'to', type: 'select', data: ['app.get', 'app.post'], static: true }]

    return (
      <Node node={node} isPreview={!node?.id} title='Cloud Api' id={node.id} color="#A5D6A7" skipCustom={true}>
        <NodeParams id={node.id} params={nodeParams} />
        <NodeParams id={node.id} params={[{ label: 'Path', field: 'param1', type: 'input', pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str + '"' }]} />
        <div style={{paddingBottom: "30px"}}>
            <FlowPort id={node.id} type='input' label='On Request (req, res)' style={{ top: '170px' }} handleId={'request'} />
            <FallbackPort node={node} port={'param2'} type={"target"} fallbackPort={'request'} portType={"_"} preText="(req, res) => " postText="" />
        </div>
      </Node>
    )
  }

  export default ApiMask