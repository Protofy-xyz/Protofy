import React, { useContext } from 'react';
import { dumpConnection, connectItem, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field, NodeParams } from '../Node';
import { FlowStoreContext } from "../store/FlowsStore";
import AddPropButton from '../AddPropButton';
import { SyntaxKind } from "ts-morph";
import { Code } from 'lucide-react';
import { useNodeColor } from '../diagram/Theme';

const JsxFragment = (node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})

    const childs: Field[] = Object.keys(nodeData).filter((p) => p.startsWith('child-')).map((prop: any, i) => {
        return { label: 'Child' + (i + 1), field: prop, fieldType: 'child', deleteable: true } as Field
    })
    const nodeParamsChilds: Field[] = childs

    return (
        <Node icon={Code}  node={node} isPreview={!id} title={"<></>"} id={id} color={color}>
            <NodeParams id={id} params={nodeParamsChilds} />
            <AddPropButton id={id} nodeData={nodeData} type={"Child"} />
        </Node>
    );
}
JsxFragment.category = 'react'
JsxFragment.keyWords = ["jsx", "jsxelement", "jsxfragment", "react", "tsx", "fragment", "selfclosed"]

JsxFragment.getData = (node, data, nodesData, edges) => {
    const childSyntaxList = node.getChildrenOfKind(SyntaxKind.SyntaxList)[0];
    const children = childSyntaxList.getChildren();
    const jsxChilds = children.filter(c => ['JsxElement', 'JsxSelfClosingElement', 'JsxExpression', 'JsxFragment'].includes(c.getKindName()))
    const childs = jsxChilds?.reduce((obj, child, i) => {
        const key = `child-${i + 1}`
        return {
            ...obj,
            [key]: connectItem(child, 'output', node, key, data, nodesData, edges, key)
        }
    }, {})
    return { ...childs }
}

JsxFragment.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id] ?? {};
    const childs = Object.keys(data).filter(key => key.startsWith('child-')).reduce((total, child) => {
        let childValue = dumpConnection(node, "target", child, PORT_TYPES.data, data[child] ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
        return total + "\t" + childValue + "\n"
    }, "")

    return `<>\n${childs}</>` + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default React.memo(JsxFragment)