import React, {  } from 'react'
import { Node } from '../../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdOutlineFileOpen } from "react-icons/md";
import Body from './lib/Body';

const Scale = (node: any = {}, nodeData = {}) => {
    return (
      <Node icon={MdOutlineFileOpen} node={node} isPreview={!node?.id} title='Scale' id={node.id} color="#FFF59D" skipCustom={true}>
        <Body node={node} previewParamName={"param5"} additionalInputArgs={[
            { label: "Scale Factor", field: 'param4', type: 'range', data: {min: 1, max: 200 }},
            ]}/>
      </Node>
    )
  }

  export default Scale