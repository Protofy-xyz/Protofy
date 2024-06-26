import React, { useState, useEffect } from "react";
import { BookOpen, Tag, Router } from '@tamagui/lucide-icons';
import { DevicesModel } from './devicesSchemas';
import { API, DataTable2, DataView, ButtonSimple, AdminPage, usePendingEffect, CardBody, ItemMenu, useWorkspaceEnv, Tinted, Chip, Connector, useSubscription } from 'protolib'
import { z } from 'protolib/base'
import { DeviceDefinitionModel } from '../deviceDefinitions';
import { connectSerialPort, flash } from "../devicesUtils";
import DeviceModal from 'protodevice/src/DeviceModal'
import * as deviceFunctions from 'protodevice/src/device'
import Subsystem from 'protodevice/src/Subsystem'
import { Paragraph, Stack, Switch, TextArea, XStack, YStack, Text } from '@my/ui';
import { getPendingResult } from "protolib/base";
import { Pencil, UploadCloud } from '@tamagui/lucide-icons';
import { usePageParams } from '../../../next';
import { onlineCompilerSecureWebSocketUrl, postYamlApiEndpoint, compileActionUrl, compileMessagesTopic } from "../devicesUtils";
import { SSR } from '../../../lib/SSR'
import { withSession } from '../../../lib/Session'

const MqttTest = ({ onSetStage, onSetModalFeedback, compileSessionId, stage }) => {
  const { message } = useSubscription([compileMessagesTopic(compileSessionId)]);
  //keep a log of messages until success/failure
  //so we can inform the user of the problems if anything fails.

  const [messages, setMessages] = useState([])
  var isDoneCompiling = false
  useEffect(() => {
    if (stage == "compile") {
      console.log("Compile Message: ", message);
      try {
        if (message?.message) {
          const data = JSON.parse(message?.message.toString());
          if (data.position != "undefined") {
            console.log("DEV: ", data)
            if (data.position && !isDoneCompiling) {
              onSetModalFeedback({
                message: `Current position in queue: ${data.position}. Status: ${data.status}`,
                details: { error: false }
              });
            } else {
              onSetModalFeedback({
                message: `Compiling...`,
                details: { error: false }
              });
              isDoneCompiling = true
            }
          }

          if (data.event == 'exit' && data.code == 0) {
            isDoneCompiling = true
            setMessages([])
            console.log("Succesfully compiled");
            onSetStage('upload')
          } else if (data.event == 'exit' && data.code != 0) {
            isDoneCompiling = true
            console.error('Error compiling', messages)
            onSetModalFeedback({
              message: <YStack f={1} height="100%">
                <Paragraph color="$red8" mt="$3">Error compiling code.</Paragraph>
                <Paragraph color="$red8">Please check your flow configuration.</Paragraph>
                <TextArea textAlign="left" f={1} mt="$2" mb={"$5"} minHeight={"200px"} value={
                  messages.map((ele) => ele.message).join('')
                }>

                </TextArea>
              </YStack>, details: { error: true }
            })
          }
          setMessages([...messages, data])
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [message])
  return <></>
}

const DevicesIcons = { name: Tag, deviceDefinition: BookOpen }

const callText = async (url: string, method: string, params?: any, token?: string): Promise<any> => {
  var fetchParams: any = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
  }


  if (params) {
    fetchParams.body = JSON.stringify(params);
  }

  let separator = '?';
  if (url.indexOf('?') != -1) {
    separator = '&';
  }

  var defUrl = url + (token ? separator + "token=" + token : "");
  console.log("Deff URL: ", defUrl)
  return fetch(defUrl, fetchParams)
    .then(function (response) {
      return response;
    }).catch((error) => {
      console.log("Error fetching url: ", error)
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
    const [targetDeviceName, setTargetDeviceName] = useState('')
    const [targetDeviceModel, setTargetDeviceModel] = useState(DevicesModel.load({}))
    const [compileSessionId, setCompileSessionId] = useState('')
    const [all, setAll] = useState(false)
    const env = useWorkspaceEnv()

    // const { message } = useSubscription(['device/compile']);

    const flashDevice = async (device, yaml?) => {
      setTargetDeviceName(device.data.name)
      setTargetDeviceModel(device)
      yamlRef.current = yaml ?? await device.getYaml(env)
      console.log("TURBO YAML PARAMETER: ", yaml)
      setShowModal(true)
      try {
        setStage('yaml')
      } catch (e) {
        console.error('error writting firmware: ', e)
      }
    }
    const sendMessage = async () => {
      const response = await fetch(compileActionUrl(targetDeviceName, compileSessionId))
      const data = await response.json()
    }

    const compile = async () => {
      // setModalFeedback({ message: `Compiling firmware...`, details: { error: false } })
      // const compileMsg = { type: "spawn", configuration: +".yaml" };
      sendMessage();
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
      try {
        const response = await callText(postYamlApiEndpoint(targetDeviceName), 'POST', { "yaml": yaml })
        const data = await response.json()
        console.log("Save Yaml, compileSessionId: ", data.compileSessionId);
        setCompileSessionId(data.compileSessionId)
      } catch (err) {
        const errorStr = "Error on fetch petition to compile.protofy.xyz: " + err
        console.log(errorStr)
        throw (errorStr)
      }
    }

    useEffect(() => {
      const process = async () => {
        if (stage == 'yaml') {
          try {
            await saveYaml(yamlRef.current)
            setTimeout(() => {
              setStage('compile')
            }, 1 * 1000);//Todo remove setTimeout
            targetDeviceModel ? await targetDeviceModel.setUploaded() : console.log("🤖 No targetDeviceModel")
          } catch (err) {
            setModalFeedback({ message: 'Error connecting to compilation server. Please verify your Internet connection.', details: { error: true } })
          }

        } else if (stage == 'compile') {
          console.log("stage - compile")
          await compile()
        } else if (stage == 'write') {

          try {
            await flash(flashCb, targetDeviceName, compileSessionId)
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
        text: "Upload definition",
        icon: UploadCloud,
        action: (element) => { flashDevice(element) },
        isVisible: (element) => true
      },
      {
        text: "Edit config file",
        icon: Pencil,
        action: (element) => { replace('editFile', element.getConfigFile()) },
        isVisible: (element) => element.isInitialized() && element.getConfigFile()
      },
      {
        text: "Upload config file",
        icon: UploadCloud,
        action: async (element) => {
          try {
            var result = await API.get("/adminapi/v1/devices/" + element.data.name + "/yaml")
            flashDevice(element, result.data.yaml)
          } catch (err) {
            console.error(err)
          }

        },
        isVisible: (element) => element.isInitialized() && element.getConfigFile()
      }
    ]

    return (<AdminPage title="Devices" pageSession={pageSession}>
      <Connector brokerUrl={onlineCompilerSecureWebSocketUrl()}>
        <DeviceModal stage={stage} onCancel={() => setShowModal(false)} onSelect={onSelectPort} modalFeedback={modalFeedback} showModal={showModal} />
        <MqttTest onSetStage={(v) => setStage(v)} onSetModalFeedback={(v) => setModalFeedback(v)} compileSessionId={compileSessionId} stage={stage} />
      </Connector>
      <DataView
        entityName="devices"
        onAdd={data => {
          return { ...data, environment: env }
        }}
        defaultView={"grid"}
        integratedChat
        key={all ? 'all' : 'filtered'}
        toolBarContent={
          <XStack mr={"$2"} f={1} space="$1.5" ai="center" jc='flex-end'>
            <Text fontSize={14} color="$color11">
              View all
            </Text>
            <Tinted>
              <Switch
                forceStyle='hover'
                checked={all}
                onCheckedChange={v => setAll(v)} size="$1"
              >
                <Switch.Thumb animation="quick" backgroundColor={"$color9"} />
              </Switch>
            </Tinted>


          </XStack>
        }
        itemData={itemData}
        rowIcon={Router}
        sourceUrl={sourceUrl}
        sourceUrlParams={all ? undefined : { env }}
        initialItems={initialItems}
        name="device"
        columns={DataTable2.columns(
          DataTable2.column("name", row => row.name, "name"),
          DataTable2.column("device definition", row => row.deviceDefinition, "deviceDefinition"),
          DataTable2.column("config", row => row.config, false, (row) => <ButtonSimple onPress={(e) => { flashDevice(DevicesModel.load(row)) }}>Upload</ButtonSimple>)
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
            <XStack right={20} top={20} position={"absolute"}>
              {data.environment && all && <Chip color={data.environment == 'dev' ? "$color5" : "$color7"} text={data.environment} />}
              <ItemMenu type="item" sourceUrl={sourceUrl} onDelete={async (sourceUrl, deviceId?: string) => {
                await API.get(`${sourceUrl}/${deviceId}/delete`)
              }} deleteable={() => true} element={DevicesModel.load(data)} extraMenuActions={extraMenuActions} />
            </XStack>
            <YStack f={1}>
              {data?.subsystem
                ? data?.subsystem?.map(element => <Subsystem subsystem={element} deviceName={data.name} />)
                : (
                  <>
                    <Paragraph mt="20px" ml="20px" size={20}>{'You need to upload the device'}</Paragraph>
                    <ButtonSimple mt="20px" ml="20px" width={100} onPress={() => { flashDevice(DevicesModel.load(data)); }}>Upload</ButtonSimple>
                  </>
                )
              }
            </YStack>
          </CardBody>
        }}
        extraMenuActions={extraMenuActions}
      />
    </AdminPage>)
  },
  getServerSideProps: SSR(async (context) => withSession(context, ['admin']))
}