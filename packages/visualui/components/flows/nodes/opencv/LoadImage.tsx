import React, {  } from 'react'
import { Node } from '../../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdOutlineFileOpen } from "react-icons/md";
import Body from './lib/Body';

const LoadImage = (node: any = {}, nodeData = {}) => {
    return (
      <Node icon={MdOutlineFileOpen} node={node} isPreview={!node?.id} title='Load Image' id={node.id} color="#EEEEEE" skipCustom={true}>
        <Body node={node} labelParam='Path' paramType='string' labelOutput='On Load (img)' />
      </Node>
    )
  }

  export default LoadImage