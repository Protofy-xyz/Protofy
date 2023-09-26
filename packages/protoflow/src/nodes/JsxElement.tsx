import React, { useContext } from 'react';
import { dumpConnection, connectItem, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field, NodeParams } from '../Node';
import { nodeColors } from '.';
import { FlowStoreContext } from "../store/FlowsStore";
import AddPropButton from '../AddPropButton';
import { SyntaxKind } from "ts-morph";
import { Code } from 'lucide-react';


const JsxElement = (node) => {
    const { id, type } = node
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})

    const name = [
        { label: 'TagName', static: true, field: 'name', type: 'input', description: 'JsxElement name' },
    ] as Field[]

    const props: Field[] = Object.keys(nodeData).filter((p) => p.startsWith('prop-')).map((prop: any, i) => {
        return { label: prop.substr(5), field: prop, fieldType: 'prop', deleteable: true } as Field
    })

    const childs: Field[] = Object.keys(nodeData).filter((p) => p.startsWith('child-')).map((prop: any, i) => {
        return { label: 'Child' + (i + 1), field: prop, fieldType: 'child', deleteable: true } as Field
    })

    const nodeParamsProps: Field[] = name.concat(props)
    const nodeParamsChilds: Field[] = childs

    return (
        <Node icon={Code} node={node} isPreview={!id} title={"<x ...></x>"} id={id} color={nodeColors[type]}>
            <NodeParams id={id} params={nodeParamsProps} />
            <AddPropButton id={id} nodeData={nodeData} type={"Prop"} />
            <NodeParams id={id} params={nodeParamsChilds} />
            <AddPropButton id={id} nodeData={nodeData} type={"Child"} />
        </Node>
    );
}
JsxElement.keyWords = ["jsx", "jsxelement", "react", "tsx", "fragment", "selfclosed"]

JsxElement.getData = (node, data, nodesData, edges) => {

    const tagName = { name: node?.getOpeningElement()?.getTagNameNode()?.getText() };
    const jsxAttributes = node?.getOpeningElement()?.getAttributes();

    const props = jsxAttributes?.reduce((obj, attribute, i) => {
        const sourceKey = attribute.getName()
        const propName = 'prop-' + sourceKey
        const sourceValue = connectItem(attribute.getInitializer(), 'output', node, propName, data, nodesData, edges, propName)
        return {
            ...obj,
            [propName]: {
                key: sourceKey ?? '',
                value: sourceValue ?? '',
            }
        }
    }, {})

    const childSyntaxList = node.getChildrenOfKind(SyntaxKind.SyntaxList)[0];
    const children = childSyntaxList.getChildren();
    const jsxChilds = children.filter(c => ['JsxElement', 'JsxSelfClosingElement', 'JsxExpression', 'JsxFragment', 'JsxText'].includes(c.getKindName()) && c.getText())
    const childs = jsxChilds?.reduce((obj, child, i) => {
        const key = `child-${i + 1}`
        return {
            ...obj,
            [key]: connectItem(child, 'output', node, key, data, nodesData, edges, key)
        }
    }, {})

    return { ...tagName, ...props, ...childs }
}

JsxElement.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id] ?? {};
    const jsxTagName = data?.name
    const fallbackText = data._fallBack?.reduce((total, fb) => {
        const content = dumpConnection(node, fb.type, fb.fallbackPort, fb.portType, null, edges, nodes, nodesData, metadata, false, 'full')
        if (!content) {
            return total = total + fb.fallbackText + " "
        } else {
            return total = total + (fb.preText + content + fb.postText) + " "
        }
    }, "") ?? ''
    const fallbackProps = data._fallBack?.map(i => i.port) ?? []
    const props = Object.keys(data).filter(key => key.startsWith('prop-') && !fallbackProps.includes(key)).reduce((total, prop) => {
        let objKey = data[prop]?.key
        let objValue = dumpConnection(node, "target", prop, PORT_TYPES.data, data[prop]?.value ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
        if (!objValue || !objKey) return total
        const objParam = `${objKey}=${objValue} `
        return total + objParam
    }, "")
    const childs = Object.keys(data).filter(key => key.startsWith('child-')).reduce((total, child) => {
        let childValue = dumpConnection(node, "target", child, PORT_TYPES.data, data[child] ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
        return total + "\t" + childValue + "\n"
    }, "")
    return `<${jsxTagName} ` + fallbackText + props + `>\n${childs}</${jsxTagName}>` + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default React.memo(JsxElement)

// WIP: if abstract JsxElement, JsxSelfClosingElement and Fragment into same box
// function getTagName(node, type): { name: string } {
//     let jsxElementName
//     switch (type) {
//         case 'JsxFragment':
//             jsxElementName = ''
//             break;
//         case 'JsxSelfClosingElement':
//             jsxElementName = node?.getTagNameNode()?.getText()
//             break;
//         case 'JsxElement':
//             jsxElementName = node?.getOpeningElement()?.getTagNameNode()?.getText();
//             break;
//         default:
//             jsxElementName = ''
//             break;
//     }
//     return {
//         name: jsxElementName,
//     }
// }

// function getAttributes(node,type): any[] {
//     let jsxAttributes
//     switch (type) {
//         case 'JsxFragment':
//             jsxAttributes = []
//             break;
//         case 'JsxSelfClosingElement':
//             jsxAttributes = node?.getAttributes()
//             break;
//         case 'JsxElement':
//             jsxAttributes = node?.getOpeningElement()?.getAttributes();
//             break;
//         default:
//             jsxAttributes = []
//             break;
//     }
//     return jsxAttributes
// }



