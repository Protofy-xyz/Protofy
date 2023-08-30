import React, {  } from 'react'
import { Node } from '../../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdReplay } from "react-icons/md";
import BodyNoPreview from './lib/BodyNoPreview';

const NextFrame = (node: any = {}, nodeData = {}) => {
    return (
      <Node icon={MdReplay} node={node} isPreview={!node?.id} title='Next Frame' id={node.id} color="#A5D6A7" skipCustom={true}>
        
      </Node>
    )
  }

  export default NextFrame