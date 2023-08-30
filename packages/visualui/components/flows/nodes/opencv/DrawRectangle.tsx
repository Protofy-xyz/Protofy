import React, { } from 'react'
import { Node } from '../../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdOutlineFileOpen } from "react-icons/md";
import Body from './lib/Body';

const DrawRectangle = (node: any = {}, nodeData = {}) => {

  return (
    <Node icon={MdOutlineFileOpen} node={node} isPreview={!node?.id} title='Draw Rectangle' id={node.id} color="#80DEEA" skipCustom={true}>
      <Body node={node} previewParamName={"param9"} additionalInputArgs={[
        { label: "X", field: 'param4', type: 'input', pre: (str) => str, post: (str) => str },
        { label: "Y", field: 'param5', type: 'input', pre: (str) => str, post: (str) => str },
        { label: "Width", field: 'param6', type: 'input', pre: (str) => str, post: (str) => str },
        { label: "Height", field: 'param7', type: 'input', pre: (str) => str, post: (str) => str },
        { label: "Color", field: 'param8', type: 'colorPicker', pre: (str)=> JSON.parse(str.replaceAll("'",'')), post:(obj)=>"'"+JSON.stringify(obj)+"'" }
      ]} />
    </Node>
  )
}

export default DrawRectangle