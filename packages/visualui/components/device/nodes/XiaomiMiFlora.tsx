import React from 'react'
import { Node, NodeParams, Field } from '../../flowslib'
import NodeBus, { cleanName, generateTopic } from '../NodeBus';
import { useAppStore } from "../../../../../context/appStore";
import { useDeviceStore } from "../../../store/DeviceStore";
import { Flex, HStack, Text } from 'native-base';

const XiaomiMiFlora = (node: any = {}, nodeData = {}, children) => {    
  const fields: Field[] = [
    { label: 'Id', static: true, field: 'param1', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str.toLowerCase() + '"' },
    { label: 'Mac Address', static: true, field: 'param2', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str.toLowerCase() + '"' },
  ]

  const type = 'sensor';
  const currentDevice = useDeviceStore(state => state.electronicDevice);
  const sensors = ['temperature', 'moisture', 'illuminance', 'soilconductivity', 'battery_level']
  const [names, setNames] = React.useState(sensors.map(sensor => cleanName(nodeData['param1'])+sensor))
  const mqttTopics = names.map(name => generateTopic(currentDevice, type, name))
  const [lastMessages, setLastMessages] = React.useState(mqttTopics.map(mqttTopic => {
    return useAppStore(state => mqttTopic?state.lastMessagesByTopic[mqttTopic]:[]) ?? []
  }))
  const [messages, setMessages] = React.useState({});

  React.useEffect(() => {
    let newMessages = {}
    
    sensors.forEach((sensor, index) => {
        const currMessageQueue = [...lastMessages[index]]
        newMessages[sensor] = currMessageQueue.length ? currMessageQueue.reverse()[0].message : undefined
    })

    setMessages(newMessages)
  }, [lastMessages])

  return (
  <Node node={node} title="Xiaomi Mi Flora" skipCustom={true} id={node.id} color="#0056ff" isPreview={!node.id}>
    <NodeParams id={node.id} params={fields}/>
      {
        names.map(name => {
            return <NodeBus componentName={name} type={type}/>
        })
      }
      <HStack mt="20px">
        <Text marginLeft={4} marginBottom={1} textAlign={"left"} color={isNaN(messages?.temperature) ? "warmGray.300" : "black"}>Temperature: {isNaN(messages?.temperature) ? 'unknown' : messages.temperature} °C</Text>
      </HStack>
      <HStack mt="5px">
        <Text marginLeft={4} marginBottom={1} textAlign={"left"} color={isNaN(messages?.moisture) ? "warmGray.300" : "black"}>Moisture: {isNaN(messages?.moisture) ? 'unknown' : messages.moisture} %</Text>
      </HStack>
      <HStack mt="5px">
        <Text marginLeft={4} marginBottom={1} textAlign={"left"} color={isNaN(messages?.illuminance) ? "warmGray.300" : "black"}>Illuminance: {isNaN(messages?.illuminance) ? 'unknown' : messages.illuminance} lx</Text>
      </HStack>
      <HStack mt="5px" mb={messages?.battery_level ? '0px' : '10px'}>
        <Text marginLeft={4} marginBottom={1} textAlign={"left"} color={isNaN(messages?.soilconductivity) ? "warmGray.300" : "black"}>Soil conductivity: {isNaN(messages?.soilconductivity) ? 'unknown' : messages.soilconductivity} µS/cm</Text>
      </HStack>
      {
        messages?.battery_level &&         
        <HStack mt="5px">
            <Text mb="10px" marginLeft={4} marginBottom={1} textAlign={"left"} color={isNaN(messages?.battery_level) ? "warmGray.300" : "black"}>Battery level: {isNaN(messages?.battery_level) ? 'unknown' : messages.battery_level} %</Text>
        </HStack>
      }
    </Node>
  )
}

export default XiaomiMiFlora