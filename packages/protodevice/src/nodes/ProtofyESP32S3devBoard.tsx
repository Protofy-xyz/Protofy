import { useContext } from "react";
import { PORT_TYPES, Node, FlowStoreContext } from 'protoflow';
import { Handle, Position, useEdges } from "reactflow";
import { getColor } from ".";

const isHandleConnected = (edges, handleId) => edges.find(e => (e.targetHandle == handleId || e.sourceHandle == handleId));

// Function to calculate positions for all ports and return a new array of ports with positions
const calculatePortPositions = (ports, offsetYTop, spacingTop, offsetYMiddle, spacingMiddle, offsetYBottom, spacingBottom, extraRightOffset) => {
    return ports.map((port, i) => {
        // Determine which group the port belongs to (top, middle, or bottom)
        const isTopGroup = [44, 43, 47, 21].includes(parseInt(port.name.replace('D', '')));
        const isMiddleGroup = [5, 4, 42, 48].includes(parseInt(port.name.replace('D', '')));
        const isLeft = port.side === "left";

        let top;
        if (isTopGroup) {
            top = i > ports.length / 2 - 1 
                ? (spacingTop * (i - ports.length / 2)) + offsetYTop + (isLeft ? 0 : extraRightOffset)
                : (spacingTop * i) + offsetYTop + (isLeft ? 0 : extraRightOffset);
        } else if (isMiddleGroup) {
            top = i > ports.length / 2 - 1 
                ? (spacingMiddle * (i - ports.length / 2)) + offsetYMiddle + (isLeft ? 0 : extraRightOffset)
                : (spacingMiddle * i) + offsetYMiddle + (isLeft ? 0 : extraRightOffset);
        } else {
            top = i > ports.length / 2 - 1 
                ? (spacingBottom * (i - ports.length / 2)) + offsetYBottom + (isLeft ? 0 : extraRightOffset)
                : (spacingBottom * i) + offsetYBottom + (isLeft ? 0 : extraRightOffset);
        }

        // Return a new port object with the position field added
        return {
            ...port,
            position: {
                top,
                side: isLeft ? Position.Left : Position.Right
            }
        };
    });
};

// Function to render handles based on the calculated port positions
const renderHandles = (portsWithPositions, edges, id) => {
    return portsWithPositions.map((port, i) => {
        const idString = `${id}${PORT_TYPES.data}element-${i + 2}`;
        const { top, side } = port.position;

        return (
            <Handle
                key={i} // Ensure key is unique
                isConnectable={!isHandleConnected(edges, idString)}
                isValidConnection={(c) => {
                    const sourceConnected = isHandleConnected(edges, c.sourceHandle);
                    return !sourceConnected;
                }}
                type={"target"}
                title={JSON.stringify(port, null, 2)} // Use port description for the title
                style={{
                    position: 'absolute',
                    top: `${top}px`,
                    width: "25px",
                    height: "25px",
                    backgroundColor: isHandleConnected(edges, idString) ? "#BA68C8" : "white",
                    // Use `left` for left-side pins, `right` for right-side pins
                    left: side === Position.Left ? '10px' : 'auto',
                    right: side === Position.Right ? '10px' : 'auto',
                    border: isHandleConnected(edges, idString) ? "2px solid #BA68C8" : "2px solid white"
                }}
                position={side}
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
    const offsetYTop = 210.5; // Initial Y offset for the top group
    const offsetYMiddle = 258; // Y offset for the middle group
    const offsetYBottom = 552; // Y offset for the bottom group

    // Spacing for each group
    const spacingTop = 49; // Spacing for the top group of ports
    const spacingMiddle = 49; // Spacing for the middle group
    const spacingBottom = 128; // Spacing for the bottom group

    // Extra offset for the right-side ports
    const extraRightOffset = 0; // Add this value to shift the right side

    const edges = useEdges();
    const metadata = useFlowsStore(state => state.metadata);
    const ports = metadata.board.ports;

    // Calculate positions for all ports and return a new array of ports with positions
    const portsWithPositions = calculatePortPositions(ports, offsetYTop, spacingTop, offsetYMiddle, spacingMiddle, offsetYBottom, spacingBottom, extraRightOffset);

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

            {/* Render handles directly from the new portsWithPositions array */}
            {renderHandles(portsWithPositions, edges, id)}
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
