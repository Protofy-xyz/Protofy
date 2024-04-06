import React, { useState, useEffect } from "react";
import { BookOpen, Tag, Router } from '@tamagui/lucide-icons';
import { DevicesModel } from './devicesSchemas';
import { API, DataTable2, DataView, ButtonSimple, Tinted, AdminPage, PaginatedDataSSR, usePendingEffect, CardBody, ItemMenu } from 'protolib'
import { z } from 'protolib/base'
import { DeviceDefinitionModel } from '../deviceDefinitions';
import { connectSerialPort, flash } from "../devicesUtils";
import { Connector, useMqttState, useSubscription } from 'mqtt-react-hooks';
import DeviceModal from 'protodevice/src/DeviceModal'
import * as deviceFunctions from 'protodevice/src/device'
import Subsystem from 'protodevice/src/Subsystem'
import { Paragraph, Stack, TextArea, XStack, YStack } from '@my/ui';
import { getPendingResult } from "protolib/base";
import { Pencil, UploadCloud } from '@tamagui/lucide-icons';
import { usePageParams } from '../../../next';


const MqttTest = ({ onSetStage, onSetModalFeedback }) => {
  const { message } = useSubscription(['device/compile']);
  //keep a log of messages until success/failure
  //so we can inform the user of the problems if anything fails.

  const [messages, setMessages] = useState([])
  useEffect(() => {
    console.log("Compile Message: ", message);
    try {
      if (message?.message) {
        const data = JSON.parse(message?.message.toString());
        if (data.event == 'exit' && data.code == 0) {
          setMessages([])
          console.log("Succesfully compiled");
          onSetStage('upload')
        } else if (data.event == 'exit' && data.code != 0) {
          console.error('Error compiling', messages)
          onSetModalFeedback({
            message: <YStack f={1} height="100%">
              <Paragraph color="$red8" mt="$3">Error compiling code.</Paragraph>
              <Paragraph color="$red8">Please check your flow configuration.</Paragraph>
              <TextArea textAlign="left" f={1} mt="$2" mb={"$5"}>
                {messages.map((ele) => ele.data).join('')}
              </TextArea>
            </YStack>, details: { error: true }
          })
        }
        setMessages([...messages, data])
      }
    } catch (err) {
      console.log(err);
    }
  }, [message])
  return <></>
}

const DevicesIcons = { name: Tag, deviceDefinition: BookOpen }

const callText = async (url: string, method: string, params?: string, token?: string): Promise<any> => {
  var fetchParams: any = {
    method: method,
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8'
    }
  }


  if (params) {
    fetchParams.body = params;
  }

  let separator = '?';
  if (url.indexOf('?') != -1) {
    separator = '&';
  }

  var defUrl = url + (token ? separator + "token=" + token : "");
  console.log("Deff URL: ", defUrl)
  return fetch(defUrl, fetchParams)
    .then(function (response) {
      if (response.status == 200) {
        return "ok";
      } console.log(response.status);
      if (!response.ok) {
      }
      return response;
    })
}

const sourceUrl = '/adminapi/v1/devices'
const definitionsSourceUrl = '/adminapi/v1/deviceDefinitions?all=1'

export default {
  component: ({ pageState, initialItems, itemData, pageSession, extraData }: any) => {
    const { replace } = usePageParams(pageState)
    if (typeof window !== 'undefined') {
      Object.keys(deviceFunctions).forEach(k => (window as any)[k] = deviceFunctions[k])
    }
    const [showModal, setShowModal] = useState(false)
    const [modalFeedback, setModalFeedback] = useState<any>()
    const [stage, setStage] = useState('')
    const yamlRef = React.useRef()
    // const { message } = useSubscription(['device/compile']);

    const flashDevice = async (deviceName, deviceDefinitionId) => {
      console.log("Flash device: ", { deviceName, deviceDefinitionId });

      const response = await API.get('/adminapi/v1/deviceDefinitions/' + deviceDefinitionId);
      if (response.isError) {
        alert(response.error)
        return;
      }
      const deviceDefinition = response.data
      const response1 = await API.get('/adminapi/v1/deviceBoards/' + deviceDefinition.board);
      if (response1.isError) {
        alert(response1.error)
        return;
      }
      console.log("---------deviceDefinition----------", deviceDefinition)
      deviceDefinition.board = response1.data
      const jsCode = deviceDefinition.config.components;
      const deviceCode = 'device(' + jsCode.replace(/;/g, "") + ')';
      console.log("-------DEVICE CODE------------", deviceCode)
      const deviceObj = eval(deviceCode)
      const componentsTree = deviceObj.getComponentsTree(deviceName, deviceDefinition)
      const yaml = deviceObj.dump("yaml")

      const subsystems = deviceObj.getSubsystemsTree(deviceName, deviceDefinition)
      const deviceObject = await API.get("/adminapi/v1/devices/" + deviceName)
      await API.post("/adminapi/v1/devices/" + deviceName + "/yamls", { yaml })
      if (deviceObject.isError) {
        alert(deviceObject.error)
        return;
      }
      deviceObject.data.subsystem = subsystems
      API.post("/adminapi/v1/devices/" + deviceName, deviceObject.data)
      console.log("ComponentsTree: ", componentsTree)
      console.log("Subsystems: ", subsystems)
      yamlRef.current = yaml
      setShowModal(true)
      try {
        setStage('yaml')
      } catch (e) {
        console.error('error writting firmware: ', e)
      }
      //const deviceObj = eval(deviceCode)
    }
    const sendMessage = async (notUsed) => {
      await fetch('https://firmware.protofy.xyz/api/v1/device/compile')
    }

    const compile = async () => {
      setModalFeedback({ message: `Compiling firmware...`, details: { error: false } })
      const compileMsg = { type: "spawn", configuration: "test.yaml" };
      sendMessage(JSON.stringify(compileMsg));
    }

    const flashCb = (msgObj) => {
      console.log(msgObj);
      setModalFeedback(state => state = msgObj)
    }

    const onSelectPort = async () => {
      const isError = await connectSerialPort()
      if (isError) return
      setStage('write')
    }

    const saveYaml = async (yaml) => {
      console.log("Save Yaml")
      console.log(await callText("https://firmware.protofy.xyz/api/v1/device/edit?configuration=test.yaml", 'POST', yaml));
    }

    useEffect(() => {
      const process = async () => {
        if (stage == 'yaml') {
          await saveYaml(yamlRef.current)
          setStage('compile')
        } else if (stage == 'compile') {
          console.log("stage - compile")
          await compile()
        } else if (stage == 'write') {
          try {
            await flash(flashCb)
            setStage('idle')
          } catch (e) { flashCb({ message: 'Error writing the device. Check that the USB connection and serial port are correctly configured.', details: { error: true } }) }
        } else if (stage == 'upload') {
          // getWebSocket()?.close()
          const chromiumBasedAgent =
            (navigator.userAgent.includes('Chrome') ||
              navigator.userAgent.includes('Edge') ||
              navigator.userAgent.includes('Opera'))

          if (chromiumBasedAgent) {
            setModalFeedback({ message: 'Connect your device and click select to chose the port. ', details: { error: false } })
            console.log('chormium based true')
          } else {
            console.log('chormium based very false')
            setModalFeedback({ message: 'You need Chrome, Opera or Edge to upload the code to the device.', details: { error: true } })
          }
        }
      }
      process()
    }, [stage])


    // useEffect(() => {
    //   console.log("Compile Message: ", message);
    //   try {
    //     if (message?.message) {
    //       const data = JSON.parse(message?.message.toString());
    //       if (data.event == 'exit' && data.code == 0) {
    //         console.log("Succesfully compiled");
    //         setStage('upload')

    //       } else if (data.event == 'exit' && data.code != 0) {
    //         console.error('Error compiling')
    //         setModalFeedback({ message: `Error compiling code. Please check your flow configuration.`, details: { error: true } })
    //       }
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }, [message])

    const [deviceDefinitions, setDeviceDefinitions] = useState(extraData?.deviceDefinitions ?? getPendingResult('pending'))
    usePendingEffect((s) => { API.get({ url: definitionsSourceUrl }, s) }, setDeviceDefinitions, extraData?.deviceDefinitions)

    const extraMenuActions = [
      {
        text: "Edit config file",
        icon: Pencil,
        action: (element) => { replace('editFile', element.getConfigFile()) },
        isVisible: (element) => element.isInitialized() && element.getConfigFile()
      },
      {
        text: "Upload",
        icon: UploadCloud,
        action: (element) => {flashDevice(element.data.name, element.data.deviceDefinition) },
        isVisible: (element) => true
      }
    ]
    
    return (<AdminPage title="Devices" pageSession={pageSession}>
      <Connector brokerUrl="wss://firmware.protofy.xyz/ws">
        <DeviceModal stage={stage} onCancel={() => setShowModal(false)} onSelect={onSelectPort} modalFeedback={modalFeedback} showModal={showModal} />
        <MqttTest onSetStage={(v) => setStage(v)} onSetModalFeedback={(v) => setModalFeedback(v)} />
      </Connector>
      <DataView
        defaultView={"grid"}
        integratedChat
        itemData={itemData}
        rowIcon={Router}
        sourceUrl={sourceUrl}
        initialItems={initialItems}
        name="device"
        columns={DataTable2.columns(
          DataTable2.column("name", "name", true),
          DataTable2.column("device definition", "deviceDefinition", true),
          DataTable2.column("config", "config", false, (row) => <ButtonSimple onPress={(e) => { flashDevice(row.name, row.deviceDefinition); }}>Upload</ButtonSimple>)
        )}
        extraFieldsForms={{
          deviceDefinition: z.union(deviceDefinitions.isLoaded ? deviceDefinitions.data.items.map(i => z.literal(DeviceDefinitionModel.load(i).getId())) : []).after('name'),
        }}
        model={DevicesModel}
        pageState={pageState}
        icons={DevicesIcons}
        dataTableGridProps={{
          disableItemSelection: true,
          onSelectItem: (item) => { },
          getBody: (data) => <CardBody title={data.name}>
            <Stack right={20} top={20} position={"absolute"}>
              <ItemMenu type="item" sourceUrl={sourceUrl} onDelete={async (sourceUrl) => {
                await API.get(sourceUrl + '/delete')
              }} deleteable={() => true} element={DevicesModel.load(data)} extraMenuActions={extraMenuActions} />
            </Stack>
            <YStack f={1}>
              {data?.subsystem 
                ? data?.subsystem?.map(element => <Subsystem subsystem={element} deviceName={data.name} />) 
                : (
                  <>
                    <Paragraph mt="20px" ml="20px" size={20}>{'You need to upload the device'}</Paragraph>
                    <ButtonSimple mt="20px" ml="20px" width={100} onPress={() => { flashDevice(data.name, data.deviceDefinition); }}>Upload</ButtonSimple>
                  </>
                )
              }
            </YStack>
          </CardBody>
        }}
        extraMenuActions={extraMenuActions}
      />
    </AdminPage>)
  }
}