import { useContext } from "react";
import { PORT_TYPES, Node, FlowStoreContext } from 'protoflow';
import { Handle, Position, useEdges } from "reactflow";
import { getColor } from ".";

const isHandleConnected = (edges, handleId) => edges.find(e => (e.targetHandle == handleId || e.sourceHandle == handleId))
//TODO Get ports from device definition
const ports = [
    { "number": 1, "side": "left", "name": "3V3", "type": "P", "analog": false, "description": "3.3 V power supply", "maxVoltage": 3.3, "rtc": false },
    { "number": 2, "side": "left", "name": "3V3", "type": "P", "analog": false, "description": "3.3 V power supply", "maxVoltage": 3.3, "rtc": false },
    { "number": 3, "side": "left", "name": "RST", "type": "I", "analog": false, "description": "EN", "maxVoltage": 3.3, "rtc": false },
    { "number": 4, "side": "left", "name": "4", "type": "IO", "analog": true, "description": "RTC_GPIO4, GPIO4, TOUCH4, ADC1_CH3", "maxVoltage": 3.3, "rtc": true },
    { "number": 5, "side": "left", "name": "5", "type": "IO", "analog": true, "description": "RTC_GPIO5, GPIO5, TOUCH5, ADC1_CH4", "maxVoltage": 3.3, "rtc": true },
    { "number": 6, "side": "left", "name": "6", "type": "IO", "analog": true, "description": "RTC_GPIO6, GPIO6, TOUCH6, ADC1_CH5", "maxVoltage": 3.3, "rtc": true },
    { "number": 7, "side": "left", "name": "7", "type": "IO", "analog": true, "description": "RTC_GPIO7, GPIO7, TOUCH7, ADC1_CH6", "maxVoltage": 3.3, "rtc": true },
    { "number": 8, "side": "left", "name": "15", "type": "IO", "analog": true, "description": "RTC_GPIO15, GPIO15, U0RTS, ADC2_CH4, XTAL_32K_P", "maxVoltage": 3.3, "rtc": true },
    { "number": 9, "side": "left", "name": "16", "type": "IO", "analog": true, "description": "RTC_GPIO16, GPIO16, U0CTS, ADC2_CH5, XTAL_32K_N", "maxVoltage": 3.3, "rtc": true },
    { "number": 10, "side": "left", "name": "17", "type": "IO", "analog": true, "description": "RTC_GPIO17, GPIO17, U1TXD, ADC2_CH6", "maxVoltage": 3.3, "rtc": true },
    { "number": 11, "side": "left", "name": "18", "type": "IO", "analog": true, "description": "RTC_GPIO18, GPIO18, U1RXD, ADC2_CH7, CLK_OUT3", "maxVoltage": 3.3, "rtc": true },
    { "number": 12, "side": "left", "name": "8", "type": "IO", "analog": true, "description": "RTC_GPIO8, GPIO8, TOUCH8, ADC1_CH7, SUBSPICS1", "maxVoltage": 3.3, "rtc": true },
    { "number": 13, "side": "left", "name": "3", "type": "IO", "analog": true, "description": "RTC_GPIO3, GPIO3, TOUCH3, ADC1_CH2", "maxVoltage": 3.3, "rtc": true },
    { "number": 14, "side": "left", "name": "46", "type": "IO", "analog": true, "description": "GPIO46", "maxVoltage": 3.3, "rtc": true },
    { "number": 15, "side": "left", "name": "9", "type": "IO", "analog": true, "description": "RTC_GPIO9, GPIO9, TOUCH9, ADC1_CH8, FSPIHD, SUBSPIHD", "maxVoltage": 3.3, "rtc": true },
    { "number": 16, "side": "left", "name": "10", "type": "IO", "analog": true, "description": "RTC_GPIO10, GPIO10, TOUCH10, ADC1_CH9, FSPICS0, FSPIIO4, SUBSPICS0", "maxVoltage": 3.3, "rtc": true },
    { "number": 17, "side": "left", "name": "11", "type": "IO", "analog": true, "description": "RTC_GPIO11, GPIO11, TOUCH11, ADC2_CH0, FSPID, FSPIIO5, SUBSPID", "maxVoltage": 3.3, "rtc": true },
    { "number": 18, "side": "left", "name": "12", "type": "IO", "analog": true, "description": "RTC_GPIO12, GPIO12, TOUCH12, ADC2_CH1, FSPICLK, FSPIIO6, SUBSPICLK", "maxVoltage": 3.3, "rtc": true },
    { "number": 19, "side": "left", "name": "13", "type": "IO", "analog": true, "description": "RTC_GPIO13, GPIO13, TOUCH13, ADC2_CH2, FSPIQ, FSPIIO7, SUBSPIQ", "maxVoltage": 3.3, "rtc": true },
    { "number": 20, "side": "left", "name": "14", "type": "IO", "analog": true, "description": "RTC_GPIO14, GPIO14, TOUCH14, ADC2_CH3, FSPIWP, FSPIDQS, SUBSPIWP", "maxVoltage": 3.3, "rtc": true },
    { "number": 21, "side": "left", "name": "5V", "type": "P", "analog": false, "description": "5 V power supply", "maxVoltage": 5.0, "rtc": false },
    { "number": 22, "side": "left", "name": "GND", "type": "G", "analog": false, "description": "Ground", "maxVoltage": 0, "rtc": false },
    
    { "number": 1, "side": "right", "name": "GND", "type": "G", "analog": false, "description": "Ground", "maxVoltage": 0, "rtc": false },
    { "number": 2, "side": "right", "name": "TX", "type": "IO", "analog": true, "description": "U0TXD, GPIO43, CLK_OUT1", "maxVoltage": 3.3, "rtc": true },
    { "number": 3, "side": "right", "name": "RX", "type": "IO", "analog": true, "description": "U0RXD, GPIO44, CLK_OUT2", "maxVoltage": 3.3, "rtc": true },
    { "number": 4, "side": "right", "name": "1", "type": "IO", "analog": true, "description": "RTC_GPIO1, GPIO1, TOUCH1, ADC1_CH0", "maxVoltage": 3.3, "rtc": true },
    { "number": 5, "side": "right", "name": "2", "type": "IO", "analog": true, "description": "RTC_GPIO2, GPIO2, TOUCH2, ADC1_CH1", "maxVoltage": 3.3, "rtc": true },
    { "number": 6, "side": "right", "name": "42", "type": "IO", "analog": true, "description": "MTMS, GPIO42", "maxVoltage": 3.3, "rtc": true },
    { "number": 7, "side": "right", "name": "41", "type": "IO", "analog": true, "description": "MTDI, GPIO41, CLK_OUT1", "maxVoltage": 3.3, "rtc": true },
    { "number": 8, "side": "right", "name": "40", "type": "IO", "analog": true, "description": "MTDO, GPIO40, CLK_OUT2", "maxVoltage": 3.3, "rtc": true },
    { "number": 9, "side": "right", "name": "39", "type": "IO", "analog": true, "description": "MTCK, GPIO39, CLK_OUT3, SUBSPICS1", "maxVoltage": 3.3, "rtc": true },
    { "number": 10, "side": "right", "name": "38", "type": "IO", "analog": true, "description": "GPIO38, FSPIWP, SUBSPIWP, RGB LED", "maxVoltage": 3.3, "rtc": true },
    { "number": 11, "side": "right", "name": "37", "type": "IO", "analog": true, "description": "SPIDQS, GPIO37, FSPIQ, SUBSPIQ", "maxVoltage": 3.3, "rtc": true },
    { "number": 12, "side": "right", "name": "36", "type": "IO", "analog": true, "description": "SPIIO7, GPIO36, FSPICLK, SUBSPICLK", "maxVoltage": 3.3, "rtc": true },
    { "number": 13, "side": "right", "name": "35", "type": "IO", "analog": true, "description": "SPIIO6, GPIO35, FSPID, SUBSPID", "maxVoltage": 3.3, "rtc": true },
    { "number": 14, "side": "right", "name": "0", "type": "IO", "analog": true, "description": "RTC_GPIO0, GPIO0", "maxVoltage": 3.3, "rtc": true },
    { "number": 15, "side": "right", "name": "45", "type": "IO", "analog": true, "description": "GPIO45", "maxVoltage": 3.3, "rtc": true },
    { "number": 16, "side": "right", "name": "48", "type": "IO", "analog": true, "description": "GPIO48, SPICLK_N, SUBSPICLK_N_DIFF", "maxVoltage": 3.3, "rtc": true },
    { "number": 17, "side": "right", "name": "47", "type": "IO", "analog": true, "description": "GPIO47, SPICLK_P, SUBSPICLK_P_DIFF", "maxVoltage": 3.3, "rtc": true },
    { "number": 18, "side": "right", "name": "21", "type": "IO", "analog": true, "description": "RTC_GPIO21, GPIO21", "maxVoltage": 3.3, "rtc": true },
    { "number": 19, "side": "right", "name": "20", "type": "IO", "analog": true, "description": "RTC_GPIO20, GPIO20, U1CTS, ADC2_CH9, CLK_OUT1, USB_D+", "maxVoltage": 3.3, "rtc": true },
    { "number": 20, "side": "right", "name": "19", "type": "IO", "analog": true, "description": "RTC_GPIO19, GPIO19, U1RTS, ADC2_CH8, CLK_OUT2, USB_D-", "maxVoltage": 3.3, "rtc": true },
    { "number": 21, "side": "right", "name": "GND", "type": "G", "analog": false, "description": "Ground", "maxVoltage": 0, "rtc": false },
    { "number": 22, "side": "right", "name": "GND", "type": "G", "analog": false, "description": "Ground", "maxVoltage": 0, "rtc": false }
]

const Esp32s3devkitc1 = ({ node = {}, nodeData = {}, topics = {}, color }: any) => {
    const { id } = node
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const offsetY = 150.3 //This value is for setting the initial point where the available pins start to draw
    const spacing = 26.6
    const edges = useEdges();

    const devicePositioning = Array(ports.length).fill(1).map((x, i) => {
        if (true) {
            return `${i + 2}-${i > ports.length/2-1 ? 'l' : 'r'}-${i}`
        }
    })
    if (!nodeData._devicePositioning) {
        setNodeData(node.id, { ...nodeData, _devicePositioning: devicePositioning })
    }
    return (
        <Node output={false} skipCustom={true} node={node} color={color} isPreview={!id} title='ESP32' id={id} margin='200px' >
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <img src={'/images/device/esp32s3-devkitc.jpg'} style={{ width: "100%" }} />
            </div>
            {Array(ports.length).fill(1).map((x, i) => {
                if (["I", "O", "IO"].includes(ports[i].type)) {                    
                    const idString = `${id}${PORT_TYPES.data}element-${i + 2}`;//${i>14?'l':'r'}
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
                            top: i > ports.length/2-1 ? (spacing * (i - ports.length/2)) + (offsetY) + 'px' : (spacing * i) + offsetY + 'px',
                            width: "15px",
                            height: "15px",
                            backgroundColor: isHandleConnected(edges, idString) ? "#BA68C8" : "white",
                            marginLeft: i > ports.length/2-1 ? '0px' : '11px',
                            marginRight: i > ports.length/2-1 ? '11px' : '0px',
                            border: isHandleConnected(edges, idString) ? "2px solid #BA68C8" : "2px solid white"
                        }}
                        position={i > ports.length/2-1 ? Position.Right : Position.Left}
                        id={idString}
                    />
                }
            })}
        </Node>
    );
}

export default {
    id: 'esp32s3devkitc1',
    type: 'ArrayLiteralExpression',
    check: (node, nodeData) => node.type == "ArrayLiteralExpression" && nodeData['element-1'] == '"esp32-s3-devkitc-1"',
    getComponent: (node, nodeData, children) => <Esp32s3devkitc1 color={getColor('esp32s3devkitc1')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: '"esp32s3devkitc1"' } },
    hidden: true,
    nonDeletable: true
}
