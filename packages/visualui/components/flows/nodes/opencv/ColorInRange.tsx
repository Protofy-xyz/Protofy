import React, {  } from 'react'
import { Node } from '../../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdOutlineFileOpen } from "react-icons/md";
import Body from './lib/Body';

const ColorInRange = (node: any = {}, nodeData = {}) => {
    return (
      <Node icon={MdOutlineFileOpen} node={node} isPreview={!node?.id} title='Color in Range' id={node.id} color="#C5E1A5" skipCustom={true}>
        <Body node={node} previewParamName={"param13"} additionalInputArgs={[
            { label: "X Min.", field: 'param4', type: 'range', data: {min: 0, max: 255 }},
            { label: "X Max.", field: 'param5', type: 'range', data: {min: 0, max: 255 }},
            { label: "Y Min.", field: 'param6', type: 'range', data: {min: 0, max: 255 }},
            { label: "Y Max.", field: 'param7', type: 'range', data: {min: 0, max: 255 }},
            { label: "Z Min.", field: 'param8', type: 'range', data: {min: 0, max: 255 }},
            { label: "Z Max.", field: 'param9', type: 'range', data: {min: 0, max: 255 }},
            { label: "Adaptive", field: 'param10', type: 'boolean'},
            { label: "Block size", field: 'param11', type: 'range', data: {min: 0, max: 255 }},
            { label: "c", field: 'param12', type: 'range', data: {min: 0, max: 255 }},
            ]}/>
      </Node>
    )
  }

  export default ColorInRange