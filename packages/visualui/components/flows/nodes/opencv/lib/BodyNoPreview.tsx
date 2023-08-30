import React, { useEffect, useContext, useRef,useState } from 'react'
import { Box, TextArea } from 'native-base';
import { Node, FlowPort, NodeParams } from '../../../../flowslib';
import { FallbackPort } from '../../../../flowslib';
import { FlowStoreContext } from '../../../../flowslib';
import { MdOutlineFileOpen } from "react-icons/md";
import { useAppStore } from '../../../../../../../context/appStore';

const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME

const BodyNoPreview = ({ node, additionalInputArgs=[], labelParam = 'Mat', paramType = 'mat', labelOutput = 'On Done (img)', cbParams = ['img']}) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const data = useFlowsStore(state => state.nodeData[node.id] ?? {})
    const id = data.param3 ? data.param3.replace(/['"]+/g, '') : '';
    const setNodeData = useFlowsStore(state => state.setNodeData)
    
    useEffect(() => {
        setNodeData(node.id, {...data, _dataNotifyId: id})
    }, [id])

    return (
        <>
            <NodeParams
                id={node.id}
                params={[{ label: labelParam, field: 'param1', type: 'input', pre: (str) => paramType == 'string' ? str.replace(/['"]+/g, '') : str, post: (str) => paramType == 'string' ? '"' + str + '"' : str }]}
            />
            <div style={{marginBottom:'50px'}}></div>
            <FlowPort id={node.id} type='output' label={labelOutput} style={{ top: '120px' }} handleId={'request'} />
            <FallbackPort fallbackText="null" node={node} port={'param2'} type={"target"} fallbackPort={'request'} portType={"_"} preText={"("+cbParams.join(',')+") => "} postText="" />
            <NodeParams
                id={node.id}
                params={additionalInputArgs}
            />
        </>
    )
}

export default BodyNoPreview