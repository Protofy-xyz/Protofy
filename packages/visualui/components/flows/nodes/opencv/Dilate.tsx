import React, {  } from 'react'
import { Node } from '../../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdOutlineFileOpen } from "react-icons/md";
import Body from './lib/Body';

const Dilate = (node: any = {}, nodeData = {}) => {
    return (
      <Node icon={MdOutlineFileOpen} node={node} isPreview={!node?.id} title='Dilate' id={node.id} color="#81D4FA" skipCustom={true}>
        <Body node={node} previewParamName={"param6"} additionalInputArgs={[
            { label: "Width", field: 'param4', type: 'range', data: {min: 1, max: 300 }},
            { label: "Height", field: 'param5', type: 'range', data: {min: 1, max: 300 }}
            ]}/>
      </Node>
    )
  }

  export default Dilate