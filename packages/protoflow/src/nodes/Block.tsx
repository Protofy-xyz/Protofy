import React, { useContext, useEffect } from 'react';
import { connectItem, dumpConnection, getId, PORT_TYPES, DumpType, createNode } from '../lib/Node';
import Node, { FlowPort, headerSize } from '../Node';
import { useEdges } from 'reactflow';
import { nodeColors } from '.';
import { FlowStoreContext } from "../store/FlowsStore";
import { NODE_TREE } from '../toggles';
import { DataOutput } from '../lib/types';
import useTheme from '../diagram/Theme';
import { Box, ListOrdered, Square } from 'lucide-react';

const blockOffset = 200
const _marginTop = 222
const minBlockHeight = 120
const singleNodeOffset = 100
const alignBlockWithChildrens = true
const _borderWidth = 5


const Block = (node) => {
    const { id, type } = node
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    const metaData = useFlowsStore(state => state.nodeData[id] && state.nodeData[id]['_metadata'] ? state.nodeData[id]['_metadata'] : {childWidth: 0, childHeight:0, childHeights:[]})
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const currentPath = useFlowsStore(state => state.currentPath)
    const nodeFontSize = useTheme('nodeFontSize')
    const portColor = useTheme('blockPort')

    const isEmpty = !metaData.childHeight
    const borderWidth = isEmpty? 0 : nodeFontSize / 3
    const marginTop = _marginTop + (useTheme('nodeFontSize')/2)
    //console.log('metadata in', node.id, metaData)
    const getBlockHeight = () => {
        if(!metaData.childHeight) return minBlockHeight
        return (metaData.childHeight+(marginTop*1.5)) + ((Math.max(0, nodeData.connections?.length - 1)) * 1)
    }

    const height = id ? getBlockHeight() : 0
    const edges = useEdges();

    const addConnection = () => {
        setNodeData(id, {
            ...nodeData,
            connections: nodeData.connections ? nodeData.connections.concat([1]) : [1]
        })
    }

    let extraStyle: any = {}
    extraStyle.minHeight = height + 'px'
    extraStyle.border = 0
    extraStyle.minWidth = type == 'CaseClause' || type == 'DefaultClause' ? '400px':'200px'
    const containerColor =  useTheme('containerColor')
    const typeConf = {
        SourceFile: {
            icon: Box,
            color: '#F7B500',
            output: false,
            title: currentPath.split(/[/\\]/).pop()
        },
        Block: {
            icon: ListOrdered,
            color: 'grey',
            title: 'Block'
        },
        CaseClause: {
            icon: Square,
            color: nodeColors[type],
            title: 'Case Clause'
        },
        DefaultClause: {
            icon: Square,
            color: nodeColors['CaseClause'],
            title: 'Case Clause'
        }
    }

    if (id) {
        React.useEffect(() => {
            const connectedEdges = edges.filter(e => e.target == id)
            if (nodeData.mode != 'json' && (connectedEdges.length == nodeData?.connections?.length || !nodeData?.connections?.length)) {
                addConnection()
            }
        }, [edges, nodeData?.connections?.length])
    }
    
    return (
        <Node
            draggable={type != 'SourceFile'}
            //contentStyle={{borderLeft:borderWidth+'px solid '+borderColor}}
            container={!isEmpty}
            style={extraStyle}
            icon={typeConf[type].icon}
            node={node}
            output={typeConf[type]['output'] == false ? null : { field: 'value', type: 'output' }}
            isPreview={!id}
            title={typeConf[type].title}
            id={id}
            params={[]}
            color={typeConf[type].color}
            dataOutput={DataOutput.block}>
            {isEmpty?<div style={{height:nodeFontSize*2+'px'}}></div>:<>
                <div style={{
                    top: nodeFontSize*2.13,
                    opacity: '0.05',
                    pointerEvents: 'none',
                    borderRadius: "0px "+nodeFontSize/4+"px "+nodeFontSize/4+ "px "+ nodeFontSize/4+'px',position:'absolute', 
                    width: metaData.childWidth+'px', 
                    height: height-headerSize-(nodeFontSize*2)+'px', 
                    backgroundColor: containerColor,
                    borderLeft: nodeFontSize/2+'px solid grey'
                }}></div>
            </>}
            <div>
                {/* {nodeData.connections?.map((ele, i) => <FlowPort id={id} type='input' label='' style={{ top: 60 + (i * 60) + 'px' }} handleId={'block' + i} />)} */}
                {nodeData.connections?.map((ele, i) => {
                    let pos = i && metaData && metaData && metaData.childHeight && metaData.childHeights && metaData.childHeights[i-1]? metaData.childHeights[i-1].height : 0
                    pos = pos + (nodeData.connections.length == 1 ? singleNodeOffset : marginTop) 
                    //pos = 60 + (i * 60)
                    return <>
                        <div style={{opacity: '0.075', left: (nodeFontSize/2)+'px', position: 'absolute', top: (pos-(nodeFontSize/4)) + 'px', width: nodeFontSize+'px', height: (nodeFontSize/2)+'px', backgroundColor: 'grey'}} />
                        <FlowPort key={i} id={id} type='input' label='' style={{ left:isEmpty?'':(nodeFontSize)+'px',top: pos + 'px' }} handleId={'block' + i} allowedTypes={["data", "flow"]}/>
                    </>
                })}
            </div>

            
            {/* <div style={{position:'absolute', width: metaData.childWidth+'px', height: borderWidth+'px', backgroundColor: borderColor}}></div>
            <div style={{top: height-borderWidth+'px', position:'absolute', width: metaData.childWidth+'px', height: borderWidth+'px', backgroundColor: borderColor}}></div>
            <div style={{top: headerSize-(borderWidth*2)+'px', position:'absolute', left: metaData.childWidth+'px', height: height-headerSize+(borderWidth*2)+'px', width: borderWidth+'px', backgroundColor: borderColor}}></div> */}
        </Node>
    );
}

Block.keyWords = ["block", "{}", "CaseClause"]
Block.defaultHandle = PORT_TYPES.flow + 'block0'
Block.getData = (node, data, nodesData, edges, mode) => {
    //connect all children in a line
    const statements = node.getStatements ? node.getStatements() : node.getDeclarations()
    statements.forEach((statement, i) => {
        const item = data[getId(statement)]
        if (!item?.type) console.error('item has no type: ', item)
        if (item?.type == 'node') {
            const targetId = item.value.id
            if (targetId) {
                connectItem(targetId, 'output', node, 'block' + i, data, nodesData, edges, null, [PORT_TYPES.data, PORT_TYPES.flow])
            }
        }
    })

    const connections = node.getStatements()
    return { connections: mode == 'json' && connections.length ? connections : connections.concat([1]), mode: mode }
}
Block.dataOutput = DataOutput.block

Block.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0, trivia='') => {
    const data = nodesData[node.id] ?? { connections: [] };
    const connections = data.connections ?? []
    const astNode = data._astNode
    var originalText: string;
    if (astNode) {
        originalText = astNode.getText()
    }
    const spacing = node.type == 'Block' ? "\t" : ""

    let body = connections.map((statement, i) => {
        const valueEdge = edges.find(e => e.targetHandle == node.id + PORT_TYPES.flow + "block" + i && e.source)
        var prefix = ''
        //  if(valueEdge) {
        //     const valueNode = nodes.find(n => n.id == valueEdge.source)
            
            //  if(valueNode) {
            //      const childAstNode = nodesData[valueNode.id]._astNode
            //      if(childAstNode) {
        //             const childFullText = childAstNode.getFullText()
        //             console.log('childFullText: ', childFullText)
        //             const pos = originalText.indexOf(childFullText)
        //             console.log('childFullText pos: ', pos)
        //             if(pos) {
        //                 prefix = originalText.substring(0, pos)
        //             }
        //             console.log('childFullText prev originalText: ', originalText)
        //             originalText = originalText.substring(pos + childFullText.length)
        //             console.log('childFullText post originalText: ', originalText)
            //      }
            //  }
        // }
        const triviaInfo = {}
        let line = dumpConnection(node, "target", "block" + i, PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level+1, triviaInfo)
        //console.log('line is: ', line, 'and trivia is: [', triviaInfo['content']+']')
        prefix = triviaInfo['content'] && triviaInfo['content'].includes("\n") || !i ? '' : "\n"+(line?spacing.repeat(level>0?level:0):'')
        line = line ? prefix + line : null
        return {code: line, trivia: triviaInfo['content'] ?? ''}
    }).filter(l => l.code)


    const blockStartSeparator = body.length && body[0].trivia.includes("\n") ? "" : "\n"
    const value = (node.type == 'Block' ? "{"+blockStartSeparator : '') + body.map(b => b.code).join("") + (node.type == 'Block' ? "\n"+spacing.repeat(Math.max(level-1, 0))+"}" : '')
    return value
}

// Block.onCreate = (nodeData, edges, nodeStore) => {
//     //const myEdges = edges.filter(edge => edge.target == nodeData.id)

//     return [nodeData].concat(nodeStore?.connections?.filter(c => !isNaN(c)).reduce((total, current, i) => {
//         const phantomId = 'Phantom_'+generateId()
//         connectItem(phantomId, 'output', nodeData.id, 'block'+i, {}, edges, null, [PORT_TYPES.data, PORT_TYPES.flow])
//         return total.concat(createNode([0, 0], 'PhantomBox', phantomId, null, false, edges, {}))
//     },[]))
// }

Block.filterChildren = (node, childNodeList, edges, nodeDataTable, setNodeData) => {
    if (!NODE_TREE) return childNodeList
    //if(!childNodeList.length || !childNodeList[0].id.startsWith('SourceFile_')) return childNodeList
    const vContainer = createNode([0, 0], "VisualGroup", 'VisualGroup_' + childNodeList[0].id, { visible: false }, false, edges)
    vContainer[0].children = childNodeList

    return vContainer;
}

Block.getWidth = (node) => {
    return 50
}

Block.getPosition = (pos, type) => {
    if(alignBlockWithChildrens) pos.y = pos.y + blockOffset
    return pos
}

Block.getSpacingFactor = () => {
    return {factorX: 1.2, factorY: 1}
}

export default Block
