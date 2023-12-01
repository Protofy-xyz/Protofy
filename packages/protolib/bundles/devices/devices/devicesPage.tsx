import React, { useState, useEffect } from "react";
import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { BookOpen, Tag, Router } from '@tamagui/lucide-icons';
import { DevicesModel } from './devicesSchemas';
import { API, DataTable2, DataView, ButtonSimple, Tinted } from 'protolib'
import { z } from 'protolib/base'
import { DeviceDefinitionModel } from '../deviceDefinitions';
import { connectSerialPort, flash } from "../devicesUtils";
import { Connector, useMqttState, useSubscription } from 'mqtt-react-hooks';
import DeviceModal from 'protodevice/src/DeviceModal'
import deviceFunctions from 'protodevice/src/device'
import subsystem from 'protodevice/src/nodes/utils/subsystem'
import { Paragraph, TextArea, XStack, YStack } from '@my/ui';

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
          onSetModalFeedback({ message: <YStack f={1} height="100%">
            <Paragraph color="$red8" mt="$3">Error compiling code.</Paragraph>
            <Paragraph color="$red8">Please check your flow configuration.</Paragraph>
            <TextArea textAlign="left" f={1} mt="$2" mb={"$5"}>
              {messages.map((ele) => ele.data).join('')}
            </TextArea>
          </YStack>, details: { error: true } })
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

export default {
  component: ({ pageState, sourceUrl, initialItems, itemData, pageSession, extraData }: any) => {
    if (typeof window !== 'undefined') {
      Object.keys(deviceFunctions).forEach(k => (window as any)[k] = deviceFunctions[k])
    } else {
      console.log("Errror")
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
      const deviceCode = 'device(' + jsCode + ')';
      console.log("-------DEVICE CODE------------", deviceCode)
      const deviceObj = eval(deviceCode)
      const componentsTree = deviceObj.getComponentsTree(deviceName, deviceDefinition)
      const yaml = deviceObj.dump("yaml")
      const subsystems = deviceObj.getSubsystemsTree(deviceName, deviceDefinition)
      API.post("/adminapi/v1/devices/" + deviceName, { subsystem: subsystems, deviceDefinition: deviceDefinitionId })
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

    return (<AdminPage title="Devices" pageSession={pageSession}>
      <Connector brokerUrl="wss://firmware.protofy.xyz/ws">
        <DeviceModal stage={stage} onCancel={() => setShowModal(false)} onSelect={onSelectPort} modalFeedback={modalFeedback} showModal={showModal} />
        <MqttTest onSetStage={(v) => setStage(v)} onSetModalFeedback={(v) => setModalFeedback(v)} />
      </Connector>
      <DataView
        integratedChat
        itemData={itemData}
        rowIcon={Router}
        sourceUrl={sourceUrl}
        initialItems={initialItems}
        numColumnsForm={1}
        name="device"
        onAdd={data => { return data }}
        onEdit={data => { return data }}
        columns={DataTable2.columns(
          DataTable2.column("name", "name", true),
          DataTable2.column("device definition", "deviceDefinition", true),
          DataTable2.column("config", "config", false, (row) => <ButtonSimple onPress={(e) => { flashDevice(row.name, row.deviceDefinition); }}>Upload</ButtonSimple>)
        )}
        extraFieldsForms={{
          deviceDefinition: z.union(extraData.deviceDefinitions.map(o => z.literal(o))).after('name'),
        }}
        model={DevicesModel}
        pageState={pageState}
        icons={DevicesIcons}
        //dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
        dataTableGridProps={{
          itemMinHeight: 320,
          itemMinWidth: 320,
          spacing: 20,
          onSelectItem: () => { },
          getBody: (data, width) => {
            var subsystemData = []
            data.subsystem.forEach(element => {
              subsystemData.push(subsystem(element, data.name))
            });
            return <YStack px={"$2"} pb="$5" f={1}>
              <Tinted>
                <Paragraph mt="20px" ml="20px" fontWeight="700" size="$7">{data.name}</Paragraph>
                {subsystemData}
              </Tinted>
            </YStack>
          }
        }}
      />
    </AdminPage>)
  },
  getServerSideProps: PaginatedDataSSR('/adminapi/v1/devices', ['admin'], {}, async () => {
    const deviceDefinitions = await API.get('/adminapi/v1/deviceDefinitions?itemsPerPage=1000')
    return {
      deviceDefinitions: deviceDefinitions.isLoaded ? deviceDefinitions.data.items.map(i => DeviceDefinitionModel.load(i).getId()) : []
    }
  })
}