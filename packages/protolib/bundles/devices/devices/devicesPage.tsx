import React, { useState,useEffect } from "react";
import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { BookOpen, Tag, Router } from '@tamagui/lucide-icons';
import { DevicesModel } from './devicesSchemas';
import { API, DataTable2, DataView, ButtonSimple } from 'protolib'
import { z } from 'zod';
import { DeviceDefinitionModel } from '../deviceDefinitions';
import { connectSerialPort, flash } from "../devicesUtils";
import { Connector, useMqttState, useSubscription  } from 'mqtt-react-hooks';

const DevicesIcons = { name: Tag, deviceDefinition: BookOpen }

export default {
  component: ({ pageState, sourceUrl, initialItems, itemData, pageSession, extraData }: any) => {
    const [modalFeedback, setModalFeedback] = useState<any>()
    const [stage, setStage] = useState('')

    const flashDevice = async (deviceName, deviceDefintionId) => {
      console.log("Flash device: ", { deviceName, deviceDefintionId });
      const response = await API.get('/adminapi/v1/deviceDefinitions/' + deviceDefintionId);
      if (response.isError) {
        alert(response.error)
        return;
      }

      const jsCode = response.data.config;
      const deviceCode = 'device(' + jsCode + ')';

      //const deviceObj = eval(deviceCode)
    }
    const sendMessage = async (notUsed)=>{
      await fetch('http://bo-firmware.protofy.xyz/api/v1/device/compile')
    }
    const { message } = useSubscription(['device/compile']);
  
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
      console.log(await callText("http://bo-firmware.protofy.xyz/api/v1/device/edit?configuration=test.yaml", 'POST', yaml));
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


    useEffect(() => {
      console.log("Compile Message: ", message);
      try {
        if (message?.message) {
          const data = JSON.parse(message?.message.toString());
          if (data.event == 'exit' && data.code == 0) {
            console.log("Succesfully compiled");
            setStage('upload')
  
          } else if (data.event == 'exit' && data.code != 0) {
            console.error('Error compiling')
            setModalFeedback({ message: `Error compiling code. Please check your flow configuration.`, details: { error: true } })
          }
        }
      } catch (err) {
        console.log(err);
      }
    }, [message])

    return (<AdminPage title="Devices" pageSession={pageSession}>
      <DataView
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
          DataTable2.column("config", "config", false, (row) => <ButtonSimple onPress={(e) => { console.log("row from Edit: ", row); flashDevice(row.name, row.deviceDefinition); onSelectPort() }}>Upload</ButtonSimple>)
        )}
        extraFieldsForms={{
          deviceDefinition: z.union(extraData.deviceDefinitions.map(o => z.literal(o))).after('name').display(),
        }}
        model={DevicesModel}
        pageState={pageState}
        icons={DevicesIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
      />
    </AdminPage>)
  },
  getServerSideProps: PaginatedDataSSR('/adminapi/v1/devices', ['admin', 'editor'], {}, async () => {
    const deviceDefinitions = await API.get('/adminapi/v1/deviceDefinitions?itemsPerPage=1000')
    return {
      deviceDefinitions: deviceDefinitions.isLoaded ? deviceDefinitions.data.items.map(i => DeviceDefinitionModel.load(i).getId()) : []
    }
  })
}