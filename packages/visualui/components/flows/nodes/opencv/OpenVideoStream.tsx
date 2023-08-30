import React, {  } from 'react'
import { Node } from '../../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdOutlineFileOpen } from "react-icons/md";
import BodyNoPreview from './lib/BodyNoPreview';

const OpenVideoStream = (node: any = {}, nodeData = {}) => {
    return (
      <Node icon={MdOutlineFileOpen} node={node} isPreview={!node?.id} title='Open Video Stream' id={node.id} color="#80CBC4" skipCustom={true}>
        <BodyNoPreview node={node} labelParam='Path' paramType='string' labelOutput='On Frame (img, vc)' cbParams={['img', 'vc']} />
      </Node>
    )
  }

  export default OpenVideoStream