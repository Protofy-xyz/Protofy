import React, { useContext } from 'react';
import { dumpConnection, connectItem, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field, NodeParams } from '../Node';
import { nodeColors } from '.';
import { FlowStoreContext } from "../store/FlowsStore";
import AddPropButton from '../AddPropButton';
import { Code } from 'lucide-react';

const JsxSelfClosingElement = (node) => {
    const { id, type } = node
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})

    const name = [
        { label: 'TagName', static: true, field: 'name', type: 'input', description: 'JsxSelfClosingElement name' },
    ] as Field[]

    const props: Field[] = Object.keys(nodeData).filter((p) => p.startsWith('prop-')).map((prop: any, i) => {
        return { label: prop.substr(5), field: prop, fieldType: 'prop', deleteable: true } as Field
    })

    const nodeParamsProps: Field[] = name.concat(props)

    return (
        <Node icon={Code} node={node} isPreview={!id} title={"<x ... />"} id={id} color={nodeColors[type]}>
            <NodeParams id={id} params={nodeParamsProps} />
            <AddPropButton id={id} nodeData={nodeData} type={"Prop"} />
        </Node>
    );
}
JsxSelfClosingElement.keyWords = ["jsx", "jsxelement", "jsxselfclosingelement", "react", "tsx", "fragment", "selfclosed"]

JsxSelfClosingElement.getData = (node, data, nodesData, edges) => {
    const tagName = { name: node?.getTagNameNode()?.getText() }
    const jsxAttributes = node?.getAttributes()

    const props = jsxAttributes?.reduce((obj, attribute, i) => {
        let sourceKey
        let sourceValue
        let propName
        if (attribute.getKindName() == "JsxSpreadAttribute") {
            propName = 'prop-spreaded-'+i;
            sourceKey = '';
            sourceValue = attribute.getText()
        } else {
            sourceKey = attribute.getNameNode().getText()
            propName = 'prop-' + sourceKey
            sourceValue = connectItem(attribute?.getInitializer(), 'output', node, propName, data, nodesData, edges, propName)
        }
        return {
            ...obj,
            [propName]: {
                key: sourceKey ?? '',
                value: sourceValue ?? '',
            }
        }
    }, {})

    return { ...tagName, ...props }
}

JsxSelfClosingElement.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level = 0) => {
    const data = nodesData[node.id] ?? {};
    const jsxTagName = data?.name
    const props = Object.keys(data).filter(key => key.startsWith('prop-')).reduce((total, prop) => {
        let objParam 
        if(prop.startsWith("prop-spreaded")) {
            objParam =  dumpConnection(node, "target", prop, PORT_TYPES.data, data[prop]?.value ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
        } else {
            let objKey = data[prop].key
            let objValue = dumpConnection(node, "target", prop, PORT_TYPES.data, data[prop]?.value ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
            objParam = `${objKey}=${objValue} `
        }
        return total + objParam
    }, "")
    return `< ${jsxTagName} ${props} />` + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default React.memo(JsxSelfClosingElement)


