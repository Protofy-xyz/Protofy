import React, {  } from 'react'
import { Node } from '../../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdPreview } from "react-icons/md";
import Body from './lib/Body';

const Preview = (node: any = {}, nodeData = {}) => {
    return (
      <Node icon={MdPreview} node={node} isPreview={!node?.id} title='Preview Image' id={node.id} color="#FFE082" skipCustom={true}>
        <Body node={node} forcePreview={true} />
      </Node>
    )
  }

  export default Preview