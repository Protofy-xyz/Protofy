import { NodeTypes } from './../../nodes';

const getChildren = (nodes, edges, node) => {   
    const children = nodes
                    .filter(n => edges.find(e => e.source == n.id && e.target == node.id))
                    .map((n) => {
                        return {
                            node: n,
                            edge: edges.find(e => e.source == n.id && e.target == node.id)
                        }
                    })
    return children
}

const defaultSpacingFactorX = 1//3.5
const defaultSpacingFactorY = 1//5

const marginX = 120 //1000
const marginY = 100 // 500 //separation in y between 2 nodes

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getParentNode(nodeData){
    var node;
    Object.keys(nodeData).forEach((key)=>{
        if(nodeData[key]._devicePositioning){
            node = {id: key, ...nodeData[key]}
        }
    })
    return node;
}

function getEdgeFromSource(edges,source){
    const out = edges.filter(e=>{
        return e.source == source;
    })
    return out[0];
}

const metas = []

const computeLayout = (nodes, edges, node, nodeData,pos={x:0, y: 0}, metadata={}, tracker={x:0}) => {
    console.log("----- ENTER ON computeLayout -----")
    console.log("Nodes: ",nodes)
    console.log("Edges: ",edges)
    console.log("Node: ", node)
    const children = getChildren(nodes, edges, node)
    const flowNode = NodeTypes[node.type]
    var nodePositionReference = 'n';

    const parentNode = getParentNode(nodeData)
    if(node.id != parentNode?.id){
        const edge = getEdgeFromSource(edges,node.id)
        nodePositionReference = parentNode._devicePositioning.filter((positionTag: string|undefined)=>{
            if(positionTag){
                return positionTag.includes(edge.targetHandle.split('element-')[1])
            }
        })[0].split('-')[1]
        console.log("nodePositionReference: ",nodePositionReference);
    }

    node.position =  {
        x: nodePositionReference=='r'?-1500+pos.x:pos.x,
        y: pos.y
    }

    node.data = {
        ...node.data,
        layouted: true
    }

    metas.push({node})
    console.log("Metas: ",metas)

    if (flowNode) {
        const flowNodeType = flowNode.type ?? flowNode
        if(flowNodeType && flowNodeType.getPosition) {
            pos = flowNodeType.getPosition(pos, node.type)
        }
    }

    const originalPosY = pos.y
    const originalPosX = pos.x

    let nodeWidth = node.width
    if (flowNode) {
        const flowNodeType = flowNode.type ?? flowNode
        if(flowNodeType && flowNodeType.getWidth) {
            nodeWidth = flowNodeType.getWidth(node)
        }
    }
    
    let spacingFactorX = defaultSpacingFactorX
    let spacingFactorY = defaultSpacingFactorY
    if (flowNode) {
        const flowNodeType = flowNode.type ?? flowNode
        if(flowNodeType && flowNodeType.getSpacingFactor) {
            const { factorX, factorY } = flowNodeType.getSpacingFactor(node)
            spacingFactorX = factorX
            spacingFactorY = factorY
        }
    }


    const deltaX = nodeWidth + (marginX*spacingFactorX)
    pos.x += deltaX


    const childHeights = []
    let prevPos
    let childTracker
    let maxTracker = 0

    children.forEach(async (c) => {
        // console.log("CHILDREN (DEVICELAYOUT): ", c.edge.targetHandle.split('element-')[1])
        // console.log("NODE INSIDE (DEVICELAYOUT): ",nodeData[node.id]._devicePositioning)
        
        if (flowNode) {
            const flowNodeType = flowNode.type ?? flowNode
            if(flowNodeType && flowNodeType.getChildPosition) {
                pos = flowNodeType.getChildPosition(node, pos, {x: originalPosX, y: originalPosY}, c, node.type)
            }
        }

        prevPos = {...pos}
        childTracker = {x:0}
        computeLayout(nodes, edges, c.node, nodeData, pos,metadata, childTracker)
        childHeights.push({
            pos: {...prevPos}, 
            delta: {x: prevPos.x-node.position.x, y: prevPos.y - originalPosY}, 
            width: childTracker.x - tracker.x, 
            height: pos.y - originalPosY, 
            node: c
        })

        if(childTracker.x > maxTracker) maxTracker = childTracker.x
    })

    tracker.x += deltaX + maxTracker

    metadata[node.id] = {layouted: true, childWidth: tracker.x, childHeight: pos.y - originalPosY, childHeights: childHeights}
    pos.x -= nodeWidth + (marginX*spacingFactorX)
    const nodeHeight = node.type == 'Block' || node.type == 'CaseClause' || node.type == 'DefaultClause' ? (metadata[node.id].childHeight?metadata[node.id].childHeight+100:0) : node.height
    pos.y += pos.y - originalPosY > (nodeHeight+(marginY*spacingFactorY)) ? 0 : (nodeHeight + (marginY*spacingFactorY)) - (pos.y - originalPosY)
    
    return metadata
}

const getLayoutedElements = async (nodes, edges, node,nodeData) => {
    const layoutedNodes = nodes.map(n => {return {...n}})
    // console.log("layoutedNodes: ",layoutedNodes)
    console.log("Enter computeLayout: ", layoutedNodes,edges,node)
    const metadata = computeLayout(layoutedNodes, edges, node,nodeData)
    console.log("Returning from computeLayout: ", metadata)
    await sleep(1)
    return { nodes:layoutedNodes, edges, metadata};
};

export default getLayoutedElements