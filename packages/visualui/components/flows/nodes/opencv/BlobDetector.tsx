import React, {  } from 'react'
import { Node } from '../../../flowslib';
import 'react-chat-widget/lib/styles.css';
import { MdOutlineFileOpen } from "react-icons/md";
import BodyNoPreview from './lib/BodyNoPreview';

const BlobDetector = (node: any = {}, nodeData = {}) => {
    return (
      <Node icon={MdOutlineFileOpen} node={node} isPreview={!node?.id} title='Blob Detector' id={node.id} color="#B39DDB" skipCustom={true}>
        <BodyNoPreview node={node} labelParam='Mat' paramType='string' labelOutput='On Done (img, rects)' cbParams={['img', 'rects']} additionalInputArgs={[
        { label: "Min Px Size", field: 'param4', type: 'input' },
        { label: "Max Px Size", field: 'param5', type: 'input' },
        { label: "Margin", field: 'param6', type: 'input' }
        ]}
        />
      </Node>
    )
  }

  export default BlobDetector