import React, { useEffect, useContext, useRef,useState } from 'react'
import { Box, TextArea } from 'native-base';
import { Node, FlowPort, NodeParams } from '../../../../flowslib';
import { FallbackPort } from '../../../../flowslib';
import { FlowStoreContext } from '../../../../flowslib';
import { MdOutlineFileOpen } from "react-icons/md";
import { useAppStore } from '../../../../../../../context/appStore';
import checkbox from '../../../../../nativebaseStartup/themes/checkbox';

const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME

const Body = ({ node, forcePreview=false, additionalInputArgs=[], labelParam = 'Mat', paramType = 'mat', labelOutput = 'On Done (img)', previewParamName="param4" }) => {
    const addChannel = useAppStore(state => state.addChannel);
    const useFlowsStore = useContext(FlowStoreContext)
    const data = useFlowsStore(state => state.nodeData[node.id] ?? {})
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const timer = useRef(0)
    const id = data.param3 ? data.param3.replace(/['"]+/g, '') : '';
    const mqttTopic = projectName + '/image';
    addChannel(mqttTopic);
    const imgRef = useRef()

    useEffect(() => {
        if(!data.viewPreviewFlag || !forcePreview) return
        if(imgRef.current) {
            imgRef.current.style.zoom = data[previewParamName] / 100
            console.log("imageRef: ",imgRef.current)
        }
    }, [data[previewParamName]])

    useEffect(() => {
        setNodeData(node.id, {...data, _dataNotifyId: id})
    }, [id])

    // Fetch initial state
    const lastMessage = useRef(useAppStore.getState().lastMessageByTopic[mqttTopic])
    
    // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
    useEffect(() => useAppStore.subscribe(
        state => (lastMessage.current = state.lastMessageByTopic[mqttTopic]),
        () => {
            const now = Date.now()
            if(!data.viewPreviewFlag || !forcePreview) return
            if(imgRef.current && now > (timer.current+100)) {
                timer.current = now
                imgRef.current.src = "/cloudapi/v1/image/" +id+"?v="+Math.random().toString();
            }
        } 
    ), [])
    
    return (
        <>
            <NodeParams
                id={node.id}
                params={[{ label: labelParam, field: 'param1', type: 'input', pre: (str) => paramType == 'string' ? str.replace(/['"]+/g, '') : str, post: (str) => paramType == 'string' ? '"' + str + '"' : str }]}
            />
            <div style={{marginBottom:'50px'}}></div>
            <FlowPort id={node.id} type='output' label={labelOutput} style={{ top: '120px' }} handleId={'request'} />
            <FallbackPort fallbackText="null" node={node} port={'param2'} type={"target"} fallbackPort={'request'} portType={"_"} preText="(img) => " postText="" />
            <NodeParams
                id={node.id}
                params={additionalInputArgs}
            />
            {forcePreview? null :<NodeParams id={node.id} params={[{hideLabel: true, label: "View Preview", field: "viewPreviewFlag", type: 'boolean'}]}/>}
            {id && (data.viewPreviewFlag||forcePreview)?<div style={{display: "inline-block", minWidth: "300px"}}>
            <NodeParams
                    id={node.id}
                    params={[{hideLabel: true, label: 'Preview scale', field: previewParamName, type: 'range', data: {min: 1, max: 200 }}]}
            />            
                <img style={{}} ref={imgRef} alt="" src={"/cloudapi/v1/image/" + id}></img>
                {/* <TextArea value={JSON.stringify(lastMessage)} marginRight={4} marginLeft={4} marginBottom={3} editable={false} placeholder="No messages to display..." /> */}
            </div>:<div style={{width: "300px"}}></div>}
        </>
    )
}

export default Body