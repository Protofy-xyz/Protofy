import React,{useContext} from "react";
import { AddPropButton, PORT_TYPES, Node, NodeParams,FlowStoreContext } from 'protoflow';
import { Handle, Position, useEdges } from "reactflow";
// import { useAppStore } from "../../../../../context/appStore";
import { useDeviceStore } from "../oldThings/DeviceStore";
// import { MaterialCommunityIcons } from '@expo/vector-icons';
import esp32c4 from '../assets/esp32c4.png';
import { useSubscription  } from 'mqtt-react-hooks';

const isHandleConnected = (edges, handleId) => edges.find(e => (e.targetHandle == handleId || e.sourceHandle == handleId))
//TODO Get ports from device definition
const ports = [
    { "number": 1, "side": "left", "name": "3V3", "type": "P", "analog": false, "description": "3V3 Power supply", "maxVoltage": 3.3, "rtc": false },
    { "number": 2, "side": "left", "name": "EN", "type": "I", "analog": false, "description": "CHIP_PU, RESET", "maxVoltage": 3.3, "rtc": false },
    { "number": 3, "side": "left", "name": "36", "type": "I", "analog": true, "description": "GPIO36, ADC1_CH0, S_VP", "maxVoltage": 3.3, "rtc": true },
    { "number": 4, "side": "left", "name": "39", "type": "I", "analog": true, "description": "GPIO39, ADC1_CH3, S_VN", "maxVoltage": 3.3, "rtc": true },
    { "number": 5, "side": "left", "name": "34", "type": "I", "analog": true, "description": "GPIO34, ADC1_CH6, VDET_1", "maxVoltage": 3.3, "rtc": true },
    { "number": 6, "side": "left", "name": "35", "type": "I", "analog": true, "description": "GPIO35, ADC1_CH7, VDET_2", "maxVoltage": 3.3, "rtc": true },
    { "number": 7, "side": "left", "name": "32", "type": "IO", "analog": true, "description": "GPIO32, ADC1_CH4, TOUCH_CH9, XTAL_32K_P", "maxVoltage": 3.3, "rtc": true },
    { "number": 8, "side": "left", "name": "33", "type": "IO", "analog": true, "description": "GPIO33, ADC1_CH5, TOUCH_CH8, XTAL_32K_N", "maxVoltage": 3.3, "rtc": true },
    { "number": 9, "side": "left", "name": "25", "type": "IO", "analog": true, "description": "GPIO25, ADC1_CH8, DAC_1", "maxVoltage": 3.3, "rtc": true },
    { "number": 10, "side": "left", "name": "26", "type": "IO", "analog": true, "description": "GPIO26, ADC2_CH9, DAC_2", "maxVoltage": 3.3, "rtc": true },
    { "number": 11, "side": "left", "name": "27", "type": "IO", "analog": true, "description": "GPIO27, ADC2_CH7, TOUCH_CH7", "maxVoltage": 3.3, "rtc": true },
    { "number": 12, "side": "left", "name": "14", "type": "IO", "analog": true, "description": "GPIO14, ADC2_CH6, TOUCH_CH6, MTMS", "maxVoltage": 3.3, "rtc": true },
    { "number": 13, "side": "left", "name": "12", "type": "IO", "analog": true, "description": "GPIO12, ADC2_CH5, TOUCH_CH5, MTDI", "maxVoltage": 3.3, "rtc": true },
    { "number": 14, "side": "left", "name": "GND", "type": "G", "analog": false, "description": "Ground", "maxVoltage": 0, "rtc": false },
    { "number": 15, "side": "left", "name": "13", "type": "IO", "analog": true, "description": "GPIO13, ADC2_CH4, TOUCH_CH4, MTCK", "maxVoltage": 3.3, "rtc": true },
    { "number": 16, "side": "left", "name": "9", "type": "IO", "analog": false, "description": "GPIO9, D2", "maxVoltage": 3.3, "rtc": false },
    { "number": 17, "side": "left", "name": "10", "type": "IO", "analog": false, "description": "GPIO10, D3", "maxVoltage": 3.3, "rtc": false },
    { "number": 18, "side": "left", "name": "11", "type": "IO", "analog": false, "description": "GPIO11, CMD", "maxVoltage": 3.3, "rtc": false },
    { "number": 19, "side": "left", "name": "5V", "type": "P", "analog": false, "description": "5V Power supply", "maxVoltage": 5.0, "rtc": false },
    { "number": 1, "side": "right", "name": "GND", "type": "G", "analog": false, "description": "Ground", "maxVoltage": 0, "rtc": false },
    { "number": 2, "side": "right", "name": "23", "type": "IO", "analog": false, "description": "GPIO23", "maxVoltage": 3.3, "rtc": false },
    { "number": 3, "side": "right", "name": "22", "type": "IO", "analog": false, "description": "GPIO22", "maxVoltage": 3.3, "rtc": false },
    { "number": 4, "side": "right", "name": "TX", "type": "IO", "analog": false, "description": "GPIO1, U0TXD", "maxVoltage": 3.3, "rtc": false },
    { "number": 5, "side": "right", "name": "RX", "type": "IO", "analog": false, "description": "GPIO3, U0RXD", "maxVoltage": 3.3, "rtc": false },
    { "number": 6, "side": "right", "name": "21", "type": "IO", "analog": false, "description": "GPIO21", "maxVoltage": 3.3, "rtc": false },
    { "number": 7, "side": "right", "name": "GND", "type": "GND", "analog": false, "description": "Ground", "maxVoltage": 0, "rtc": false },
    { "number": 8, "side": "right", "name": "19", "type": "IO", "analog": false, "description": "GPIO19", "maxVoltage": 3.3, "rtc": false },
    { "number": 9, "side": "right", "name": "18", "type": "IO", "analog": false, "description": "GPIO18", "maxVoltage": 3.3, "rtc": false },
    { "number": 10, "side": "right", "name": "5", "type": "IO", "analog": false, "description": "GPIO5", "maxVoltage": 3.3, "rtc": false },
    { "number": 11, "side": "right", "name": "17", "type": "IO", "analog": false, "description": "GPIO17", "maxVoltage": 3.3, "rtc": false },
    { "number": 12, "side": "right", "name": "16", "type": "IO", "analog": false, "description": "GPIO16", "maxVoltage": 3.3, "rtc": false },
    { "number": 13, "side": "right", "name": "4", "type": "IO", "analog": true, "description": "GPIO4, ADC2_CH0, TOUCH_CH0", "maxVoltage": 3.3, "rtc": true },
    { "number": 14, "side": "right", "name": "0", "type": "IO", "analog": true, "description": "GPIO0, ADC2_CH1, TOUCH_CH1, Boot", "maxVoltage": 3.3, "rtc": true },
    { "number": 15, "side": "right", "name": "2", "type": "IO", "analog": true, "description": "GPIO2, ADC2_CH2, TOUCH_CH2", "maxVoltage": 3.3, "rtc": true },
    { "number": 16, "side": "right", "name": "15", "type": "IO", "analog": true, "description": "GPIO15, ADC2_CH3, TOUCH_CH3, MTDO", "maxVoltage": 3.3, "rtc": true },
    { "number": 17, "side": "right", "name": "8", "type": "IO", "analog": false, "description": "GPIO8, D1", "maxVoltage": 3.3, "rtc": false },
    { "number": 18, "side": "right", "name": "7", "type": "IO", "analog": false, "description": "GPIO7, D0", "maxVoltage": 3.3, "rtc": false },
    { "number": 19, "side": "right", "name": "CLK", "type": "IO", "analog": false, "description": "GPIO6, CLK", "maxVoltage": 3.3, "rtc": false }
]

const Device = (node: any = {}, nodeData: any = {}, topics: any = {}) => {
    const { publish, data } = topics;
    const { id, type } = node
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const currentDevice = useDeviceStore(state => state.electronicDevice);
    const offsetY = 856 //This value is for setting the initial point where the available pins start to draw
    const spacing = 46
    const edges = useEdges();

    // const changeDeviceName = () => {
    //     const isValidDevice = () => !(!(nodeData['element-0'] == '') || nodeData['element-0'].includes(' ') || nodeData['element-0'].includes('.'))
    //     if (isValidDevice()) {
    //         if (nodeData['element-0'] == currentDevice) return
    //         publish('device/changedDeviceName', { deviceName: nodeData['element-0'], oldDeviceName: currentDevice, ts: Date.now() })
    //     }
    // }

    const params = [
        // { label: 'Name', onBlur:()=>changeDeviceName(), field: 'element-0', type: 'input', static: true, pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str.toLowerCase() + '"'},
        { label: 'Name', isDisabled: true, field: 'element-0', type: 'input', static: true },
        { label: 'WiFi SSID', field: 'element-2', type: 'input', static: true },
        { label: 'WiFi Password', field: 'element-3', type: 'input', static: true },
        {
            label: 'WiFi Power mode', field: 'element-4', type: 'select', static: true,
            data: ['"none"', '"light"', '"high"'],
        },
        { label: 'MQTT Address', field: 'element-5', type: 'input', static: true },
        { label: 'Enable Deep-Sleep', static: true, field: 'element-6', type: 'boolean' },
        { label: 'Deep-Sleep run duration', field: 'element-7', type: 'input', static: true},
        { label: 'Deep-Sleep sleep duration', field: 'element-8', type: 'input', static: true },
        {
            label: 'Wakeup Pin', static: true, field: 'element-9', type: 'select',
            data: ports.filter(port => port.type.includes('I') && !['EN', '36', '39', 'CLK'].includes(port.name) && port.rtc == true).map(port => port.name)
        }

    ]
    // const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME
    // const mqttTopic = `${projectName}/${currentDevice}/status`
    // const { message } = useSubscription(['newplatform/mydevice/status']);
    // const addChannel = useAppStore(state => state.addChannel)
    // const lastMessage = useAppStore(state => state.lastMessageByTopic[mqttTopic]) ?? []
    // addChannel(mqttTopic);
    // TODO: Replace mqtt connectivity
    // const [lastMessage, setLastMessage] = React.useState({ message: "offline" })
    // END-TODO
    // const [connected, setConnected] = React.useState("offline");

    const onCompile = () => {
        publish('flows-editor/play', { ts: Date.now() })
    }
    // React.useEffect(() => {
    //     if (lastMessage.message == 'online') {
    //         setConnected("online");
    //     } else {
    //         setConnected("offline")
    //     }
    // }, [lastMessage])

    // React.useEffect(() => {
    //     if (message?.message == 'online') {
    //         setConnected("online");
    //     } else {
    //         setConnected("offline")
    //     }
    // }, [message])
    const devicePositioning = Array(34).fill(1).map((x,i)=>{
        if (i != 9 && i != 14 && i != 13 && i != 15 && i != 21 && i != 33 && i != 28) {
            return `${i + 10}-${i>14?'l':'r'}-${i}`
        }
    })
    console.log("DevicePositioning: ", devicePositioning)
    if(!nodeData._devicePositioning){
        setNodeData(node.id,{...nodeData, _devicePositioning: devicePositioning})
    }
    return (
        <Node output={false} skipCustom={true} node={node} color='#8FCAF9' isPreview={!id} title='ESP32' id={id}  >
            {/* <Button onPress={onCompile} w="40%" alignSelf={'center'} endIcon={<Icon as={MaterialCommunityIcons} name={'upload'} />} m="14px">Upload</Button> */}
            {/* <button onClick={onCompile} style={{ width: "40%", alignSelf: 'center', margin: "14px", border:"1px solid #cccccc", borderRadius:"5px", padding:"10px"}}>Upload</button> */}
            {/* <div style={{ alignItems: 'center', justifyContent: 'flex-end', paddingLeft: "14px", paddingRight: "14px", paddingTop: "10px",paddingBottom: "10px" }}>
                <p style={{ marginRight: '5px' }}>{connected}<span style={{backgroundColor: connected=="online"?"green":"red",display:"inline-block", width: "12px", height: "12px", borderRadius: "40px", marginLeft: "15px"}}></span></p>
            </div> */}
            {<NodeParams id={id} params={params} />}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <img src={esp32c4.src} style={{ width: "100%" }} />
            </div>
            {Array(34).fill(1).map((x, i) => {
                if (i != 9 && i != 14 && i != 13 && i != 15 && i != 21 && i != 33 && i != 28) {
                    const idString = `${id}${PORT_TYPES.data}element-${i + 10}`;//${i>14?'l':'r'}
                    return <Handle
                        key={i}
                        isConnectable={!isHandleConnected(edges, idString)}
                        isValidConnection={(c) => {
                            const sourceConnected = isHandleConnected(edges, c.sourceHandle)
                            return !sourceConnected
                        }}
                        type={"target"}
                        style={{
                            position: 'absolute',
                            top: i > 14 ? (spacing * (i - 15)) + (offsetY - (spacing * 4)) + 'px' : (spacing * i) + offsetY + 'px',
                            width: "26px",
                            height: "26px",
                            backgroundColor: isHandleConnected(edges, idString) ? "#BA68C8" : "white",
                            marginLeft: i > 14 ? '0px' : '14px',
                            marginRight: i > 14 ? '14px' : '0px',
                            border: isHandleConnected(edges, idString) ? "2px solid #BA68C8" : "2px solid white"
                        }}
                        position={i > 14 ? Position.Right : Position.Left}
                        id={idString}
                    />
                }
            })}
            <AddPropButton id={id} nodeData={nodeData} type={"Component"} style={{ marginBottom: '20px' }} />
        </Node>
    );
}

export default Device
