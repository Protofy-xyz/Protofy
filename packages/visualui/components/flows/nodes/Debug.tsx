import {
  TextArea,
  Text
} from 'native-base';
import { Node, NodeParams } from '../../flowslib';
import { FlowStoreContext } from '../../flowslib';
import { useAppStore } from 'baseapp/context/appStore';
import React, { useContext } from 'react'
import { MdOutlineFindInPage } from "react-icons/md";

const Debug = (node: any = {}) => {
    const addChannel = useAppStore(state => state.addChannel)
    const lastMessages = useAppStore(state => state.lastMessagesByTopic['_debug/' + process.env.NEXT_PUBLIC_PROJECT_NAME]) ?? []
    addChannel('_debug/' + process.env.NEXT_PUBLIC_PROJECT_NAME)
    const useFlowsStore = useContext(FlowStoreContext)
    const data = useFlowsStore(state => state.nodeData[node.id] ?? {})
    const id = data.param1 ? data.param1.replace(/['"]+/g, '') : ''
    const messages = id ? lastMessages.filter(m => m.message.id == id).map(m => m.message.message).reverse() : []
    return (
      <Node icon={MdOutlineFindInPage} node={node} isPreview={!node.id} title='Debug' id={node.id} color="#BCAAA4" skipCustom={true}>
        <NodeParams id={node.id} params={[{ label: 'Message', field: 'param2', type: 'input' }]} />
        <Text marginLeft={4} marginBottom={1} textAlign={"left"} color="warmGray.300">Logs</Text>
        <TextArea value={messages.length ? JSON.stringify(messages, null, 4) : null} marginRight={4} marginLeft={4} marginBottom={3} editable={false} placeholder="No messages to display..." />
      </Node>
    )
  }

  export default Debug