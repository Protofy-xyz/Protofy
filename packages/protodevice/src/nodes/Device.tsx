import React,{useContext} from "react";
import { AddPropButton, PORT_TYPES, Node, NodeParams,FlowStoreContext } from 'protoflow';
import { Handle, Position, useEdges } from "reactflow";
// import { useAppStore } from "../../../../../context/appStore";
import { useDeviceStore } from "../oldThings/DeviceStore";
// import { MaterialCommunityIcons } from '@expo/vector-icons';
import { pinTable } from "../device/Device";
import esp32c4 from '../assets/esp32c4.png';
import { useSubscription  } from 'mqtt-react-hooks';

const isHandleConnected = (edges, handleId) => edges.find(e => (e.targetHandle == handleId || e.sourceHandle == handleId))

const Device = (node: any = {}, nodeData: any = {}, topics: any = {}) => {
    const { publish, data } = topics;
    const { id, type } = node
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const currentDevice = useDeviceStore(state => state.electronicDevice);
    const offsetY = 996 //This value is for setting the initial point where the available pins start to draw
    const spacing = 46
    const edges = useEdges();

    const changeDeviceName = () => {
        const isValidDevice = () => !(!(nodeData['element-0'] == '') || nodeData['element-0'].includes(' ') || nodeData['element-0'].includes('.'))
        if (isValidDevice()) {
            if (nodeData['element-0'] == currentDevice) return
            publish('device/changedDeviceName', { deviceName: nodeData['element-0'], oldDeviceName: currentDevice, ts: Date.now() })
        }
    }

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
            data: pinTable.filter(item => !['GND', 'CMD', '0'].includes(item))
        }

    ]
    const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME
    const mqttTopic = `${projectName}/${currentDevice}/status`
    const { message } = useSubscription(['newplatform/mydevice/status']);
    // const addChannel = useAppStore(state => state.addChannel)
    // const lastMessage = useAppStore(state => state.lastMessageByTopic[mqttTopic]) ?? []
    // addChannel(mqttTopic);
    // TODO: Replace mqtt connectivity
    const [lastMessage, setLastMessage] = React.useState({ message: "offline" })
    // END-TODO
    const [connected, setConnected] = React.useState("offline");

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

    React.useEffect(() => {
        if (message?.message == 'online') {
            setConnected("online");
        } else {
            setConnected("offline")
        }
    }, [message])
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
            <button onClick={onCompile} style={{ width: "40%", alignSelf: 'center', margin: "14px", border:"1px solid #cccccc", borderRadius:"5px", padding:"10px"}}>Upload</button>
            <div style={{ alignItems: 'center', justifyContent: 'flex-end', paddingLeft: "14px", paddingRight: "14px", paddingTop: "10px",paddingBottom: "10px" }}>
                <p style={{ marginRight: '5px' }}>{connected}<span style={{backgroundColor: connected=="online"?"green":"red",display:"inline-block", width: "12px", height: "12px", borderRadius: "40px", marginLeft: "15px"}}></span></p>
                {/* <Icon as={MaterialCommunityIcons} color={connected == 'online' ? 'green.500' : 'error.600'} name={'circle'} /> */}
            </div>
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
            {/* <AddPropButton id={id} nodeData={nodeData} type={"Component"} style={{ marginBottom: '20px' }} /> */}
        </Node>
    );
}

export default Device
