import React, { useState, useEffect, useRef } from "react";
import { Transport, ESPLoader } from "./device/esptool-js";
import { sleep } from "./sleep";
import { Build, FlashError } from "./const";
import { manifest } from "./manifest";
import ApiCaller from './oldThings/apiCaller';
import Settings from './oldThings/settings';
import useWebSocket from 'react-use-websocket';
import { FlowFactory } from 'protoflow';
import { useFetch } from 'usehooks-ts'
import deviceFunctions from './device'
import DeviceModal from "./DeviceModal";
import customComponents from "./nodes"
import { useDeviceStore } from "./oldThings/DeviceStore";
// import DeviceSelector from "./DeviceSelector";
import { withTopics } from "react-topics";
import { useFlowsStore } from 'protoflow';
import { Spinner, XStack } from 'tamagui'
import dynamic from 'next/dynamic'
import { useThemeSetting } from '@tamagui/next-theme'
import { Connector, useMqttState, useSubscription  } from 'mqtt-react-hooks';

// class ExternalApiConfig {
//   config;
//   constructor(config) {
//     this.config = config
//   }
// }

// const compilerAPIParams = new ExternalApiConfig({url})

const Flow = FlowFactory('device')
const deviceStore = useFlowsStore()
const MqttStatus = ({})=> {
  /*
   * Status list
   * - Offline
   * - Connected
   * - Reconnecting
   * - Closed
   * - Error: printed in console too
   */
  const { connectionStatus } = useMqttState();
  useEffect(()=>{
    console.log("STATUS -----> ", connectionStatus)
  },[connectionStatus])

  return(<></>)
}



const FlowsWidget = dynamic(() => import('../../protolib/adminpanel/features/components/FlowsWidget'), {
    // loading: () => <Center>
    //     <Spinner size={'large'} scale={3} top={-50} />
    //     Loading
    // </Center>,
    loading: () => <>
        <Spinner size={'large'} scale={3} top={-50} />
        Loading
    </>,
    ssr: false
})

if (typeof window !== 'undefined') {
  Object.keys(deviceFunctions).forEach(k => (window as any)[k] = deviceFunctions[k])
}


//@ts-ignore
var port: SerialPort | undefined;


const resetTransport = async (transport: Transport) => {
  await transport.device.setSignals({
    dataTerminalReady: false,
    requestToSend: true,
  });
  await transport.device.setSignals({
    dataTerminalReady: false,
    requestToSend: false,
  });
};

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

const saveYaml = async (yaml) => {
  console.log("Save Yaml")
  console.log(await callText("http://bo-firmware.protofy.xyz/api/v1/device/edit?configuration=test.yaml", 'POST', yaml));
}



const DeviceScreen = ({ deviceDefinition, isActive,topics}) => {
  const topicData = topics;
  const p = {"config":"[\n  \"mydevice\",\n  \"esp32dev\",\n  \"POROTOVICE\",\n  \"********\",\n  \"none\",\n  \"51.68.45.86\",\n  false,\n  \"10\",\n  \"10\",\n  34,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  relay(\"light\", \"ALWAYS_OFF\"),\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n  null,\n];\n\n"}
  const [sourceCode, setSourceCode] = useState(p.config)
  // const currentDevice = useDeviceStore(state => state.electronicDevice);
  // const setCurrentDevice = useDeviceStore(state => state.setElectronicDevice);
  // console.log('currentDevice: ', currentDevice)
  // console.log('sourceCode: ', sourceCode)
  // const [positions, setPositions] = useState();
  // const devicesList = useDeviceStore(state => state.devicesList)
  // const setDevicesList = useDeviceStore(state => state.setDevicesList)
  const [showModal, setShowModal] = useState(false)
  const [stage, setStage] = useState('')
  //const [configError, setConfigError] = useState<string>()
  const [modalFeedback, setModalFeedback] = useState<any>()
  const yamlRef = useRef()

  const connectSerialPort = async () => {
    let isError = true
    try {
      port = await navigator.serial.requestPort();
    } catch (err: any) {
      if ((err as DOMException).name === "NotFoundError") {
        //setConfigError(state => ('Please select a port.'))
        return isError;
      }
      //setConfigError(state => ('Error configuring port.'))
      return isError;
    }

    if (!port) {
      //setConfigError(state => ('Error trying to request port. Please check your browser drivers.'))
      return isError;
    }
    try {
      await port.open({ baudRate: 115200 });
      //setConfigError('') 
    } catch (err: any) {
      //setConfigError(state => ('Error can not open serial port.'))
      return isError;
    }
  }

  const flash = async (cb) => {
    cb({ message: 'Please hold "Boot" button of your ESP32 board.' })
    let build: Build | undefined;
    let chipFamily: Build["chipFamily"];
    const transport = new Transport(port);
    const esploader = new ESPLoader(
      transport,
      115200,
      // Wrong type, fixed in https://github.com/espressif/esptool-js/pull/75/files
      undefined as any
    );

    //ESptools like to reopen the port
    await port.close();
    // For debugging
    (window as any).esploader = esploader;
    try {
      await esploader.main_fn();
      //await esploader.flash_id(); //not used -> seems taht not affects to correct function
    } catch (err: any) {
      console.error(err);
      cb({ message: "Failed to initialize. Try resetting your device or holding the BOOT button while clicking INSTALL.", details: { error: FlashError.FAILED_INITIALIZING, details: err } });
      await resetTransport(transport);
      await transport.disconnect();
      throw "Failed to initialize. Try resetting your device or holding the BOOT button while clicking INSTALL."
    }
    chipFamily = esploader.chip.CHIP_NAME as any;
    console.log("chipFamily: ", chipFamily);
    if (!esploader.chip.ROM_TEXT) {
      cb({ message: `Chip ${chipFamily} is not supported`, details: { error: FlashError.NOT_SUPPORTED, details: `Chip ${chipFamily} is not supported` } })
      await resetTransport(transport);
      await transport.disconnect();
      throw `Chip ${chipFamily} is not supported`
    }
    cb({ message: `Initialized. Found ${chipFamily}`, details: { done: true } })

    build = manifest.builds.find((b) => b.chipFamily === chipFamily);

    if (!build) {
      cb({ message: `Your ${chipFamily} board is not supported.`, details: { error: FlashError.NOT_SUPPORTED, details: chipFamily } })
      await resetTransport(transport);
      await transport.disconnect();
      throw `Your ${chipFamily} board is not supported.`
    }

    cb({ message: "Preparing installation...", details: { done: false } })

    const filePromises = build.parts.map(async (part) => {

      // const url = "http://bo-firmware.protofy.xyz/api/v1" + "/electronics/download.bin?configuration=" + "test.yaml" + "&type=firmware-factory.bin"
      const onlineCompilerUrl = "http://bo-firmware.protofy.xyz/api/v1";
      const url = "http://bo-firmware.protofy.xyz/api/v1" + "/device/download?configuration=" + "test.yaml" + "&type=firmware-factory.bin"
      
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(
          `Downlading firmware ${url} failed: ${resp.status}`
        );
      }

      const reader = new FileReader();
      const blob = await resp.blob();

      return new Promise<string>((resolve) => {
        reader.addEventListener("load", () => resolve(reader.result as string));
        reader.readAsBinaryString(blob);
      });

    });
    const fileArray: Array<{ data: string; address: number }> = [];
    let totalSize = 0;

    for (let part = 0; part < filePromises.length; part++) {
      try {
        const data = await filePromises[part];
        fileArray.push({ data, address: build.parts[part].offset });
        totalSize += data.length;
      } catch (err: any) {
        cb({ message: err.message, details: { error: FlashError.FAILED_FIRMWARE_DOWNLOAD, details: err.message } })
        await resetTransport(transport);
        await transport.disconnect();
        return;
      }
    }
    cb({ message: "Installation prepared", details: { done: true } })

    if (true) {
      cb({ message: "Erasing device...", details: { done: false } })
      await esploader.erase_flash();
      cb({ message: "Device erased", details: { done: true } })
    }
    cb({ message: `Writing progress: 0%`, details: { bytesTotal: totalSize, bytesWritten: 0, percentage: 0 } })

    let totalWritten = 0;

    try {
      await esploader.write_flash(
        fileArray,
        "keep",
        "keep",
        "keep",
        false,
        true,
        // report progress
        (fileIndex: number, written: number, total: number) => {
          const uncompressedWritten =
            (written / total) * fileArray[fileIndex].data.length;

          const newPct = Math.floor(
            ((totalWritten + uncompressedWritten) / totalSize) * 100
          );
          if (written === total) {
            totalWritten += uncompressedWritten;
            return;
          }
          cb({ message: `Writing progress: ${newPct}%`, details: { bytesTotal: totalSize, bytesWritten: totalWritten + written, percentage: newPct } })
        }
      );
    } catch (err: any) {
      cb({ message: err.message, details: { error: FlashError.WRITE_FAILED, details: err } })
      await resetTransport(transport);
      await transport.disconnect();
      return;
    }
    cb({ message: "Writing complete", details: { bytesTotal: totalSize, bytesWritten: totalWritten, percentage: 100 } })

    await sleep(100);
    console.log("HARD RESET");
    await resetTransport(transport);
    console.log("DISCONNECT");
    await transport.disconnect();
    cb({ message: "All done!" })
  }
  // wss://dev-vault.dev-cloud.protofy.xyz/electronics/compile
  // const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket("ws://bo-firmware.protofy.xyz/electronics/compile", {
  //   onError: (err)=>{
  //     console.error(err)
  //   },
  //   onOpen: () => {
  //     console.log('WebSocket connection established.');
  //   },
  //   onClose: () => {
  //     console.log('WebSocket connection closed.');
  //   },
  //   shouldReconnect: (closeEvent) => true
  // });

  const sendMessage = async (notUsed)=>{
    await fetch('http://bo-firmware.protofy.xyz/api/v1/device/compile')
  }
  const { message } = useSubscription(['device/compile']);

  const compile = async () => {
    setModalFeedback({ message: `Compiling firmware...`, details: { error: false } })
    const compileMsg = { type: "spawn", configuration: "test.yaml" };
    sendMessage(JSON.stringify(compileMsg));
  }

  // React.useEffect(() => {
  //   console.log("Compile Message: ", lastMessage);
  //   try {
  //     if (lastMessage?.data) {
  //       const data = JSON.parse(lastMessage?.data);
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
  // }, [lastMessage])

  React.useEffect(() => {
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


  // const { error, data } = useFetch(`/api/v1/device/${currentDevice}/config`)
  // const readDevices = async () => {
  //   try {
  //     // const listOfDevicesStr = await fetch('/api/v1/device/list')
  //     // const listOfDevices = await listOfDevicesStr.json()
  //     const listOfDevices ={"mydevice":{"light":{"type":"switch","mqttMessages":{"options":["ON","OFF"]}}}} 
  //     setDevicesList(listOfDevices)
  //   } catch (e) { console.log(e) }
  // }

  const flashCb = (msgObj) => {
    console.log(msgObj);
    setModalFeedback(state => state = msgObj)
  }

  const checkWifiPowerMode = (deviceCode, newWifiPowerMode) => {
    const lines = deviceCode.split('\n')
    console.log('newWifiPowerMode', newWifiPowerMode)
    lines[5] = `  "${newWifiPowerMode}",`

    const newDeviceCode = lines.join('\n')
    return newDeviceCode
  }

  const onSave = async (code) => {
    const apiCaller = new ApiCaller()
    try {
      // await apiCaller.call(`/v1/device/${currentDevice}/config`, 'POST', { code: code })
      const deviceCode = 'device(' + code.slice(0, -2) + ')';
      // console.log('save code in device: ', deviceCode);

      const deviceObj = eval(deviceCode)
      const yaml = deviceObj.setMqttPrefix(process.env.NEXT_PUBLIC_PROJECT_NAME).create(deviceDefinition)

      const modifiedCode = checkWifiPowerMode(code, deviceObj.wifiPowerMode)
      console.log('modifiedCode', modifiedCode, code)

      yamlRef.current = yaml
      console.log('yaml generated: ', yaml)

      // await apiCaller.call(`/v1/device/${currentDevice}/config`, 'POST', { code: modifiedCode})
      // await apiCaller.call(`/v1/device/${currentDevice}/yaml`, 'POST', { code: yaml})
      // readDevices()
    } catch (e) { console.error(e) }
  }
  const onPlay = (code) => {
    const deviceCode = 'device(' + code + ')';

    const deviceObj = eval(deviceCode)
    // const yaml = deviceObj.setMqttPrefix(process.env.NEXT_PUBLIC_PROJECT_NAME).create()
    const yaml = deviceObj.setMqttPrefix("newplatform").create(deviceDefinition)
    yamlRef.current = yaml

    setShowModal(true)
    try {
      setStage('yaml')
    } catch (e) {
      console.error('error writting firmware: ', e)
    }
  }

  const onSelectPort = async () => {
    const isError = await connectSerialPort()
    if (isError) return
    setStage('write')
  }

  // const onCreateDevice = async (newDeviceName: string) => {
  //   const isValidDevice = () => !(Object.keys(devicesList).map(d => d.lastIndexOf('.') || d).includes(newDeviceName) || !newDeviceName || newDeviceName.includes(' ') || newDeviceName.includes('.'))
  //   if (isValidDevice()) {
  //     try {
  //       const apiCaller = new ApiCaller()
  //       await apiCaller.call(`/v1/device/${newDeviceName}/add`, 'GET') // adds new device
  //       // await readDevices()
  //     } catch (e) { console.error(`Error creating device page. Error: ${e}`) }
  //   }
  // }

  // const onSelectDevice = async (device: string) => {
  //   try {
  //     // const apiCaller = new ApiCaller()
  //     // const newContent = await apiCaller.call(`/v1/device/${device}/config`, 'GET') // gets device content
  //     // if (!newContent) return
  //     // setSourceCode(newContent.config)
  //     setCurrentDevice(device)
  //   } catch (e) {
  //     console.error(`Error getting device source code. Error: ${e}`)
  //   }
  // }



  // useEffect(() => {
  //   if (data) {
  //     console.log(data.config)
  //     //@ts-ignore
  //     setSourceCode(data.config)
  //     // setPositions(JSON.parse(data.positions))
  //   }
  // }, [data])

  //TODO CHANGE FOR useFETCH
  // useEffect(() => {
  //   readDevices()
  // }, [])

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
  //   if (topicData.data['device/changedDeviceName']) {
  //     if (topicData.data['device/changedDeviceName'].deviceName) {
  //       alert("deviceNameChanged")
  //     }
  //   }
  // }, [topicData.data['device/changedDeviceName']])

  // const [fileContent, setFileContent] = useFileFromAPI(path)
  const { resolvedTheme } = useThemeSetting()

  return (
      <div style={{ width: '100%', display: 'flex', flex: 1 }}>
      <MqttStatus/>
        <DeviceModal stage={stage} onCancel={() => setShowModal(false)} onSelect={onSelectPort} modalFeedback={modalFeedback} showModal={showModal} />
        {sourceCode ?
          // <Flow
          //   flowId={'device'}
          //   disableDots={!isActive}
          //   hideBaseComponents={true}
          //   // positions={positions}
          //   customComponents={customComponents}
          //   getFirstNode={(nodes) => {
          //     return nodes.find(n => n.type == 'ArrayLiteralExpression')
          //   }}
          //   disableStart={true}
          //   onSave={onSave}
          //   onPlay={onPlay}
          //   sourceCode={sourceCode}
          //   store={deviceStore}
          //   showActionsBar={true}
          //   mode="device"
          // /> : null}
          <FlowsWidget
                    // icons={<XStack position="absolute" right={isFull ? 0 : 50} top={isFull ? -35 : -32}>
                    //     <IconContainer onPress={() => { }}>
                    //         {/* <SizableText mr={"$2"}>Save</SizableText> */}
                    //         <Save color="var(--color)" size={isFull ? "$2" : "$1"} />
                    //     </IconContainer>
                    // </XStack>}
                    // isModified={isModified}
                    // setIsModified={setIsModified}
                    onPlay={onPlay}
                    onSave={(o)=>{console.log("ON SAVE: ",o); console.log("sourceCode ", sourceCode)}}
                    hideBaseComponents={true}
                    disableStart={true}
                    getFirstNode={(nodes) => {
                          return nodes.find(n => n.type == 'ArrayLiteralExpression')
                    }}
                    showActionsBar={true}     
                    mode={"device"}
                    bridgeNode={false}
                    // setSourceCode={(sourceCode) => {
                    //     console.log('set new sourcecode from flows: ', sourceCode)
                    //     setSourceCode(sourceCode)
                    // }} 
                    sourceCode={sourceCode} themeMode={resolvedTheme} />:null}
        {/* <DeviceSelector devicesList={devicesList} currentDevice={currentDevice} onCreateDevice={onCreateDevice} onSelectDevice={onSelectDevice} /> */}
      </div>
  )
};

// export default DeviceScreen;

export default withTopics(DeviceScreen, { topics: ['device/changedDeviceName'] });

// export default ()=><div>Hello</div>