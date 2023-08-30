import React, {  } from 'react'
import { Node } from '../../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdInvertColors } from "react-icons/md";
import Body from './lib/Body';

const BitwiseNot = (node: any = {}, nodeData = {}) => {
    return (
      <Node icon={MdInvertColors} node={node} isPreview={!node?.id} title='Color Invert' id={node.id} color="#F48FB1" skipCustom={true}>
        <Body node={node} />
      </Node>
    )
  }

  export default BitwiseNot