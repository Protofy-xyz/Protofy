import { connectNodes } from './Edge';
import { NodeTypes } from '../nodes';
import { generateId } from './IdGenerator';

const nodeWidth = 300;
const nodeHeight = 200;
const disableFieldCompilation = false

export const createNode = (
    position: [number, number],
    type: string,
    id?: string,
    data?: any,
    deletable?: boolean,
    edges?: any,
    nodeStore?: any
) => {
    let nodeData = {
        id: id ?? generateId(),
        position: { x: position[0], y: position[1] },
        data: data ?? {},
        type,
        deletable: deletable,
        selectable: deletable,
        draggable: false
        // width: nodeWidth,
        // height: nodeHeight
    }

    if (NodeTypes[type] && NodeTypes[type].onCreate) {
        return NodeTypes[type].onCreate(nodeData, edges, nodeStore)
    }
    return [nodeData]
}

export function saveNodes(nodes: any[], edges: any[], nodesData: any, getFirstNode, mode) {
    //get start node
    const startNode = getFirstNode(nodes, nodesData)
    if (!startNode) {
        return ""; //?
    }
    let start = NodeTypes[startNode.type]
    if (start.type) start = start.type
    const code = start.dump(startNode, nodes, edges, nodesData, null, mode != 'json', "full")
    if(mode == 'json') {
        const finalCode = JSON.stringify(JSON.parse(code), null, 4);
        return finalCode
    }
    const validatedRawCode = validateCode(code, mode);
    if (validatedRawCode) {
        const finalCode = start.dump(startNode, nodes, edges, nodesData, null, false, "full")
        return finalCode
    }
    //TODO: handle error, look for markers and highlight the box
    return '';
}

export function validateCode(content: string, mode: string) {
    return content
}

export function getId(node) {
    try {
        return node.getKindName() + '_' + node._compilerNode.pos + '_' + node._compilerNode.end
    } catch (e) {
        return node
    }
}

export function getScope(node, scope = []) {
    return node.getParent() ? getScope(node.getParent(), scope.concat(node)) : scope
}

export const PORT_TYPES = {
    flow: '_',
    data: '-'
}
export const POKA_HANDLE_TYPES = {
    prop: ['JsxExpression'],
    expression: ['ArrowFunction', 'CallExpression', 'JsxElement', 'JsxFragment', 'JsxSelfClosingElement', 'ObjectBindingPattern', 'ObjectLiteralExpression'],
    child: ['Block', 'JsxElement', 'JsxFragment', 'JsxSelfClosingElement'],
    incrementor: ['BinaryExpression'],
    initializer: ['letNode', 'varNode'],
    condition: ['BinaryExpression', 'CallExpression'],
    declarationName: ['ObjectBindingPattern'],
    accessName: ['BinaryExpression', 'CallExpression', 'ElementAccessExpression'],
    setLeft: ['ElementAccessExpression'], // left is different when it's a set or operator
    left: ['ArrayLiteralExpression', 'BinaryExpression', 'CallExpression', 'ElementAccessExpression'],
    right: ['ArrayLiteralExpression', 'BinaryExpression', 'CallExpression', 'ElementAccessExpression'],
    to: ['ElementAccessExpression'],
    param: ['ArrayLiteralExpression', 'ArrowFunction', 'BinaryExpression', 'CallExpression', 'Function', 'JsxElement', 'JsxFragment', 'JsxSelfClosingElement', 'ObjectBindingPattern', 'ObjectLiteralExpression', 'ParenthesizedExpression'],
    key: ['SpreadAssignment'],
    name: ['ElementAccessExpression'],
    value: ['ArrayLiteralExpression', 'CallExpression', 'ElementAccessExpression'],
    block: [], // all
    request: ['Block', 'CallExpression'],
    then: ['BinaryExpression', 'Block', 'CallExpression'],
    else: ['BinaryExpression', 'Block', 'CallExpression'],
    constructor: ['MethodDeclaration'],
    body: ['Block'],
    union: ['TypeLiteral']
}

export function connectItem(sourceNode, sourcePort, targetNode, targetPort, data, nodesData, edges, key = null, portTypes = [PORT_TYPES.data, PORT_TYPES.data]) {
    if (!sourceNode || !targetNode) return ''

    try {
        const sourceId = getId(sourceNode)
        const targetId = getId(targetNode)
        let itemSource = data[sourceId]
        let itemTarget = data[targetId]


        if (!itemSource) {
            itemSource = { type: 'node', value: { id: sourceId } }
        }

        if (!itemTarget) {
            itemTarget = { type: 'node', value: { id: targetId } }
        }

        if (itemSource.type == 'node') {
            edges.push(connectNodes(itemSource.value.id, `${itemSource.value.id}${portTypes[0]}${sourcePort}`, itemTarget.value.id, `${itemTarget.value.id}${portTypes[1]}${targetPort}`))
            if (disableFieldCompilation) return ''
            var type = NodeTypes[sourceId.split('_')[0]]
            if (!type) return ''
            type = type.type ? type.type : type
            const nodes = Object.keys(data).filter(k => data[k] && data[k].type == 'node').map(x => data[x].value)
            const code = type.dump({ id: sourceId, type: sourceId.split('_')[0] }, nodes, edges, nodesData)
            return code.replace(/(\r\n|\n|\r)/gm, "");
        } else {
            if (key && itemSource._astNode) {
                try {
                    nodesData[targetId]['trivia-' + key] = getTrivia(itemSource._astNode)
                } catch (e) {
                }
            }
            return itemSource ? itemSource.value : ""
        }
    } catch (e) {
        console.error('Error connecting nodes: ', e, sourceNode, sourcePort, targetNode, targetPort)
        return ''
    }
}

export type DumpType = "full" | "partial"

export function getTrivia(astNode) {
    const fullText: string = astNode.getFullText()
    if (astNode.getLeadingTriviaWidth()) {
        return fullText.substring(0, astNode.getLeadingTriviaWidth())
    }
    return ''
}

export function getValueTrivia(data, valKey) {
    return (data['trivia-' + valKey] ?? ' ') + (data[valKey] ?? '')
}

export const getSizeOfLastChild = (childHeights) => childHeights[childHeights.length - 1].height - (childHeights.length > 2 ? childHeights[childHeights.length - 2].height : 0)

export function getConnectedNode(node, nodes, edges, portType, portName) {
    const port = node.id + portType + portName
    const valueEdge = edges.find(e => (e.targetHandle == port) && e.source)
    if (valueEdge) {
        const valueNode = nodes.find(n => n.id == valueEdge.source)
        return valueNode
    }
    return false
}

export function dumpConnection(node, connection: "source" | "target", portName, portType, defaultValue, edges, nodes, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level = 0, triviaInfo = {}, disableTrivia=false) {
    const edgeKey = connection == 'source' ? 'sourceHandle' : 'targetHandle'
    // e.source condition is because there is an edge without source that could match
    const valueEdge = edges.find(e => e[edgeKey] == node.id + portType + portName && e.source)
    if (valueEdge) {
        const valueNode = nodes.find(n => n.id == (connection == 'target' ? valueEdge.source : valueEdge.target))
        if (!valueNode) return defaultValue
        let valueComponent = NodeTypes[valueNode.type]
        if (valueComponent.type) valueComponent = valueComponent.type
        const marker = enableMarkers ? '/* JSFLOWID(' + (valueNode && valueNode.id ? valueNode.id : '') + ') */' : ''
        let extraContent = ''
        triviaInfo['fromFile'] = false
        if (valueComponent) {
            if (!disableTrivia && nodesData[valueNode.id] && nodesData[valueNode.id]._astNode) {
                const astNode = nodesData[valueNode.id]._astNode;
                triviaInfo['fromFile'] = true
                extraContent = getTrivia(astNode)
                triviaInfo['content'] = extraContent
            }

            const val = valueComponent.dump(valueNode, nodes, edges, nodesData, metadata, enableMarkers, dumpType, level, extraContent)
            return marker + (dumpType == 'full' ? extraContent : '')+ val
        }
    }
    return defaultValue
}