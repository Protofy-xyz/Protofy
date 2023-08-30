import React, { } from 'react'
import { Node } from '../../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdOutlineFileOpen } from "react-icons/md";
import Body from './lib/Body';

const Crop = (node: any = {}, nodeData = {}) => {

  return (
    <Node icon={MdOutlineFileOpen} node={node} isPreview={!node?.id} title='Crop' id={node.id} color="#FFF49D" skipCustom={true}>
      <Body node={node} previewParamName={"param8"} additionalInputArgs={[
        { label: "X", field: 'param4', type: 'input', pre: (str) => str, post: (str) => str },
        { label: "Y", field: 'param5', type: 'input', pre: (str) => str, post: (str) => str },
        { label: "Width", field: 'param6', type: 'input', pre: (str) => str, post: (str) => str },
        { label: "Height", field: 'param7', type: 'input', pre: (str) => str, post: (str) => str },
      ]} />
    </Node>
  )
}

export default Crop