import React, { useEffect, useContext } from 'react'
import { Node, NodeParams } from '../../flowslib';
import { FlowStoreContext } from '../../flowslib';
import { useDeviceStore } from '../../../store/DeviceStore';
import { MdSecurityUpdateGood } from "react-icons/md";


const DevicePub = (node: any = {}) => {
  const useFlowsStore = useContext(FlowStoreContext)
  const devicesList = useDeviceStore(state => state.devicesList) ?? {}
  const data = useFlowsStore(state => state.nodeData[node.id] ?? {})
  const setNodeData = useFlowsStore(state => state.setNodeData)
  const optionType = !data.mqttOptions ? 'input' : 'select'

  useEffect(() => {
    if (!data || (!data['param1'] || data['param1'].replace(/['"]+/g, '') == 'undefined') || !data['param3'] || !Object.keys(devicesList).length) return
    if (!devicesList[data['param1']?.replace(/['"]+/g, '')]) return console.error('Error setting "Device Pub" components. ')
    const type = devicesList[data['param1'].replace(/['"]+/g, '')][data['param3'].replace(/['"]+/g, '')]?.type
    const selectedComponentData = devicesList[data['param1']?.replace(/['"]+/g, '')][data['param3']?.replace(/['"]+/g, '')]
    setNodeData(node.id, {
      ...data,
      param2: '"' + type + '"',
      description: selectedComponentData?.mqttMessages?.example,
      mqttOptions: selectedComponentData?.mqttMessages?.options ?? null
    })
  }, [data['param3'], devicesList])

  const params = [
    { label: 'Device', field: 'param1', type: 'select', data: Object.keys(devicesList)?.map(i => '"' + i + '"') },
    { label: 'Component', field: 'param3', type: 'select', data: Object.keys(devicesList[data['param1']?.replace(/['"]+/g, '')] ?? {}).map(i => '"' + i + '"') },
  ]
  return (
    <Node icon={MdSecurityUpdateGood} node={node} isPreview={!node.id} title='Device Pub' id={node.id} color="#FFE082" skipCustom={true}>
      <NodeParams id={node.id} params={params} />
      <NodeParams key={optionType} id={node.id} params={[{ label: 'message (js)', field: 'param4', type: optionType, description: JSON.stringify(data?.description), pre: (str) => str, post: (str) => str, data: data.mqttOptions ? data.mqttOptions.map(i => '"' + i + '"') : null}]} />
    </Node>
  )
}

export default DevicePub