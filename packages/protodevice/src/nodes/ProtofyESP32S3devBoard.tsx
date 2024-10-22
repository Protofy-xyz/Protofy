import { useContext } from "react";
import { PORT_TYPES, Node, FlowStoreContext } from 'protoflow';
import { Handle, Position, useEdges } from "reactflow";
import { getColor } from ".";

const isHandleConnected = (edges, handleId) => edges.find(e => (e.targetHandle == handleId || e.sourceHandle == handleId))

const renderHandles = (ports, offsetY, spacing, extraRightOffset, edges, id, topGroupLength) => {
    const descriptions = ports.map(port => ({
        name: port.name,
        type: port.type,
        description: port.description,
        maxVoltage: port.maxVoltage,
        rtc: port.rtc
    }));
    return ports.map((port, i) => {
        const idString = `${id}${PORT_TYPES.data}element-${i + topGroupLength + 2}`;
        const isLeft = port.side === "left"; // Add side logic from metadata

        return (
            <Handle
                key={i + topGroupLength} // Ensure key is unique
                isConnectable={!isHandleConnected(edges, idString)}
                isValidConnection={(c) => {
                    const sourceConnected = isHandleConnected(edges, c.sourceHandle);
                    return !sourceConnected;
                }}
                type={"target"}
                title={JSON.stringify(descriptions[i], null, 2)} // Adjust index for description
                style={{
                    position: 'absolute',
                    top: i > ports.length / 2 - 1
                        ? (spacing * (i - ports.length / 2)) + offsetY + (isLeft ? 0 : extraRightOffset) + 'px'
                        : (spacing * i) + offsetY + (isLeft ? 0 : extraRightOffset) + 'px',
                    width: "15px",
                    height: "15px",
                    backgroundColor: isHandleConnected(edges, idString) ? "#BA68C8" : "white",
                    marginLeft: isLeft ? '133px' : '0px',
                    marginRight: isLeft ? '0px' : '133px',
                    border: isHandleConnected(edges, idString) ? "2px solid #BA68C8" : "2px solid white"
                }}
                position={isLeft ? Position.Left : Position.Right}
                id={idString}
            />
        );
    });
};

const ProtofyESP32S3devBoard = ({ node = {}, nodeData = {}, topics = {}, color }: any) => {
    const { id } = node;
    const useFlowsStore = useContext(FlowStoreContext);
    const setNodeData = useFlowsStore(state => state.setNodeData);

    // Adjusted offsets for top, middle, and bottom groups
    const offsetYTop = 184.5; // Initial Y offset for the top group
    const offsetYMiddle = 337; // Y offset for the middle group
    const offsetYBottom = 1022; // Y offset for the bottom group

    // Spacing for each group
    const spacingTop = 26.6; // Spacing for the top group of ports
    const spacingMiddle = 26.6; // Spacing for the middle group
    const spacingBottom = 126.3; // Spacing for the bottom group

    // Extra offset for the right-side ports
    const extraRightOffset = 75.2; // Add this value to shift the right side

    const edges = useEdges();
    const metadata = useFlowsStore(state => state.metadata);
    const ports = metadata.board.ports;

    // Manually define port numbers based on your new groupings
    const topPorts = ports.filter(port => [44, 43, 47, 21].includes(parseInt(port.name.replace('D', ''))));
    const middlePorts = ports.filter(port => [5, 4, 42, 48].includes(parseInt(port.name.replace('D', ''))));
    const bottomPorts = ports.filter(port => ![44, 43, 47, 21, 5, 4, 42, 48].includes(parseInt(port.name.replace('D', ''))));



    const devicePositioning = Array(ports.length).fill(1).map((x, i) => {
        return `${i + 2}-${i > ports.length / 2 - 1 ? 'l' : 'r'}-${i}`;
    });

    if (!nodeData._devicePositioning) {
        setNodeData(node.id, { ...nodeData, _devicePositioning: devicePositioning });
    }

    return (
        <Node output={false} skipCustom={true} node={node} color={color} isPreview={!id} title="Protofy ESP32S3 devBoard" id={id} margin="200px">
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <img src={'/images/device/ProtofyESP32S3devBoard.png'} style={{ width: "100%" }} />
            </div>

            {/* Render top group of ports */}
            {renderHandles(topPorts, offsetYTop, spacingTop, extraRightOffset, edges, id, 0)}

            {/* Render middle group of ports */}
            {renderHandles(middlePorts, offsetYMiddle, spacingMiddle, extraRightOffset, edges, id, topPorts.length)}

            {/* Render bottom group of ports */}
            {renderHandles(bottomPorts, offsetYBottom, spacingBottom, extraRightOffset, edges, id, topPorts.length + middlePorts.length)}

        </Node>
    );
};

export default {
    id: 'protofyESP32S3devBoard',
    type: 'ArrayLiteralExpression',
    check: (node, nodeData) => node.type == "ArrayLiteralExpression" && nodeData['element-1'] == '"Protofy ESP32S3 devBoard"',
    getComponent: (node, nodeData, children) => <ProtofyESP32S3devBoard color={getColor('protofyESP32S3devBoard')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: '"protofyESP32S3devBoard"' } },
    hidden: true,
    nonDeletable: true
};
