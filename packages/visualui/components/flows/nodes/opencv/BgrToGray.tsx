import React, {  } from 'react'
import { Node } from '../../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdOutlineFileOpen } from "react-icons/md";
import Body from './lib/Body';

const BgrToGray = (node: any = {}, nodeData = {}) => {
    return (
      <Node icon={MdOutlineFileOpen} node={node} isPreview={!node?.id} title='BGR to Gray' id={node.id} color="#B0BEC5" skipCustom={true}>
        <Body node={node} />
      </Node>
    )
  }

  export default BgrToGray