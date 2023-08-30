import React, {  } from 'react'
import { Node, NodeParams } from '../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdPublish } from "react-icons/md";

const TopicPub = (node: any = {}) => {
    return (
      <Node icon={MdPublish} node={node} isPreview={!node.id} title='Publish' id={node.id} color="#FFAB91" skipCustom={true}>
        <NodeParams id={node.id} params={[{ label: 'Topic', field: 'param1', type: 'input', pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str + '"' }]} />
        <NodeParams id={node.id} params={[{ label: 'Message (js)', field: 'param2', type: 'input', pre: (str) => str, post: (str) => str }]} />
      </Node>
    )
  }

  export default TopicPub