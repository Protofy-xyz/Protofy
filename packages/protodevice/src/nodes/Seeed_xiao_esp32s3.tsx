import { useContext } from "react";
import { PORT_TYPES, Node, FlowStoreContext } from 'protoflow';
import { Handle, Position, useEdges } from "reactflow";
import { getColor } from ".";
import seeed_xiao_esp32s3 from '../assets/seeed_xiao_esp32s3.png';

const isHandleConnected = (edges, handleId) => edges.find(e => (e.targetHandle == handleId || e.sourceHandle == handleId))

const ports = [
    { "number": 1, "side": "left", "name": "44", "type": "IO", "analog": true, "description": "", "maxVoltage": 3.3, "rtc": false },
    { "number": 2, "side": "left", "name": "7", "type": "IO", "analog": true, "description": "", "maxVoltage": 3.3, "rtc": true },
    { "number": 3, "side": "left", "name": "8", "type": "IO", "analog": true, "description": "", "maxVoltage": 3.3, "rtc": true },
    { "number": 4, "side": "left", "name": "9", "type": "IO", "analog": true, "description": "", "maxVoltage": 3.3, "rtc": true },
    { "number": 5, "side": "left", "name": "3V3", "type": "P", "analog": false, "description": "3V3 Power supply", "maxVoltage": 3.3, "rtc": true },
    { "number": 6, "side": "left", "name": "GND", "type": "G", "analog": false, "description": "Ground", "maxVoltage": 0, "rtc": false },
    { "number": 7, "side": "left", "name": "VUSB", "type": "P", "analog": false, "description": "USB Voltage", "maxVoltage": 5.0, "rtc": false },

    { "number": 1, "side": "right", "name": "43", "type": "IO", "analog": true, "description": "", "maxVoltage": 3.3, "rtc": false },
    { "number": 2, "side": "right", "name": "6", "type": "IO", "analog": true, "description": "", "maxVoltage": 3.3, "rtc": true },
    { "number": 3, "side": "right", "name": "5", "type": "IO", "analog": true, "description": "", "maxVoltage": 3.3, "rtc": true },
    { "number": 4, "side": "right", "name": "4", "type": "IO", "analog": true, "description": "", "maxVoltage": 3.3, "rtc": true },
    { "number": 5, "side": "right", "name": "3", "type": "IO", "analog": true, "description": "", "maxVoltage": 3.3, "rtc": false },
    { "number": 6, "side": "right", "name": "2", "type": "IO", "analog": true, "description": "", "maxVoltage": 3.3, "rtc": true },
    { "number": 7, "side": "right", "name": "1", "type": "IO", "analog": true, "description": "", "maxVoltage": 3.3, "rtc": true }
]

//remove number, side, descriptyion from ports

const portsDescriptions = ports.map(port => {
    return {
        name: port.name,
        type: port.type,
        description: port.description,
        maxVoltage: port.maxVoltage,
        rtc: port.rtc
    }
})

const Seeed_xiao_esp32s3 = ({ node = {}, nodeData = {}, topics = {}, color }: any) => {
    const { id, type } = node
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const offsetY = 99 //This value is for setting the initial point where the available pins start to draw
    const spacing = 30.4
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
        <Node output={false} skipCustom={true} node={node} color={color} isPreview={!id} title='XIAO ESP32S3' id={id} margin='200px' >
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <img src={seeed_xiao_esp32s3.src} style={{ width: "100%" }} />
            </div>
            {/* //TODO Get ports from device definition */}
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
                        //get name, type, description, maxVoltage, rtc from port
                        title={JSON.stringify(portsDescriptions[i], null, 2)}
                        style={{
                            position: 'absolute',
                            top: i > ports.length/2-1 ? (spacing * (i - ports.length/2)) + (offsetY) + 'px' : (spacing * i) + offsetY + 'px',
                            width: "17px",
                            height: "17px",
                            backgroundColor: isHandleConnected(edges, idString) ? "#BA68C8" : "white",
                            marginLeft: i > ports.length/2-1 ? '0px' : '15px',
                            marginRight: i > ports.length/2-1 ? '15px' : '0px',
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
    id: 'seeed_xiao_esp32s3',
    type: 'ArrayLiteralExpression',
    check: (node, nodeData) => node.type == "ArrayLiteralExpression" && nodeData['element-1'] == '"seeed_xiao_esp32s3"',
    getComponent: (node, nodeData, children) => <Seeed_xiao_esp32s3 color={getColor('seeed_xiao_esp32s3')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: '"seeed_xiao_esp32s3"' } },
    hidden: true,
    nonDeletable: true
}
