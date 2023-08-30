import React, { } from 'react'
import { Box } from 'native-base';
import { Node, FlowPort, NodeParams } from '../../flowslib';
import { FallbackPort } from '../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdFileDownload } from "react-icons/md";

const TopicSub = (node: any = {}, nodeData = {}) => {
  return (
    <Node icon={MdFileDownload} node={node} isPreview={!node?.id} title='Subscribe' id={node.id} color="#FFCC80" skipCustom={true}>
      <NodeParams id={node.id} params={[{ label: 'Path', field: 'param1', type: 'input', pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str + '"' }]} />
      <Box mb={'50px'}></Box>
      <FlowPort id={node.id} type='output' label='On Message' style={{ top: '110px' }} handleId={'request'} />
      <FallbackPort node={node} port={'param2'} type={"source"} fallbackPort={'request'} portType={"_"} preText="(message,topic) => {" postText="}" />
    </Node>
  )
}

export default TopicSub