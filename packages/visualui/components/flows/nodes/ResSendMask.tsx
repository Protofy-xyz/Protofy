import React, { } from 'react'
import { Node, NodeParams } from '../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdOutlineReplyAll } from "react-icons/md";

const ResSendMask = (node: any = {}) => {
  return (
    <Node icon={MdOutlineReplyAll} node={node} isPreview={!node.id} title='Api Response' id={node.id} color="#C4E1A5" skipCustom={true}>
      <NodeParams id={node.id} params={[{ label: 'Response', field: 'param1', type: 'input' }]} />
    </Node>
  )
}
export default ResSendMask