import React, { useEffect, useContext } from 'react'
import { Box } from 'native-base';
import { Node, FlowPort, NodeParams } from '../../flowslib';
import { FallbackPort } from '../../flowslib';
import { FlowStoreContext } from '../../flowslib';
import { useDeviceStore } from '../../../store/DeviceStore';
import 'react-chat-widget/lib/styles.css';
import { MdSecurityUpdate } from "react-icons/md";

const DeviceSub = (node: any = {}, nodeData = {}) => {
    const devicesList = useDeviceStore(state => state.devicesList) ?? {}
    const useFlowsStore = useContext(FlowStoreContext)
    const data = useFlowsStore(state => state.nodeData[node.id] ?? {})
    const setNodeData = useFlowsStore(state => state.setNodeData)
    useEffect(() => {
      if (!data || (!data['param1'] || data['param1'].replace(/['"]+/g, '') == 'undefined') || !data['param3'] || !Object.keys(devicesList).length) return
      if(!devicesList[data['param1']?.replace(/['"]+/g, '')]) return console.error('Error setting "Device Sub" components. ')
      const type = devicesList[data['param1'].replace(/['"]+/g, '')][data['param3'].replace(/['"]+/g, '')]?.type
      setNodeData(node.id, {
        ...data,
        param2: '"' + type + '"'
      })
    }, [data['param3'], devicesList])
  
    return (
      <Node icon={MdSecurityUpdate} node={node} isPreview={!node?.id} title='Device Sub' id={node.id} color="#FFF49D" skipCustom={true}>
        <NodeParams id={node.id} params={[{ label: 'Device', field: 'param1', type: 'select', data: Object.keys(devicesList)?.map(i => '"' + i + '"') }]} />
        {/* <NodeParams id={node.id} params={[{ label: 'componentType', field: 'param2', type: 'input', pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str + '"' }]} /> */}
        <NodeParams id={node.id} params={[{ label: 'Component', field: 'param3', type: 'select', data: Object.keys(devicesList[data['param1']?.replace(/['"]+/g, '')] ?? {}).map(i => '"' + i + '"') }]} />
        <Box mb={'50px'}></Box>
        <FlowPort id={node.id} type='output' label='On (message, topic)' style={{ top: '170px' }} handleId={'request'} />
        <FallbackPort node={node} port={'param4'} type={"target"} fallbackPort={'request'} portType={"_"} preText="(message,topic) => " postText="" />
      </Node>
    )
  }

  export default DeviceSub