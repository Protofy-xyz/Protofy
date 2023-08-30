import React, {  } from 'react'
import { Node } from '../../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdOutlineFileOpen } from "react-icons/md";
import Body from './lib/Body';

const GrayToBgr = (node: any = {}, nodeData = {}) => {
    return (
      <Node icon={MdOutlineFileOpen} node={node} isPreview={!node?.id} title='Gray to BGR' id={node.id} color="#CE93D8" skipCustom={true}>
        <Body node={node} />
      </Node>
    )
  }

  export default GrayToBgr