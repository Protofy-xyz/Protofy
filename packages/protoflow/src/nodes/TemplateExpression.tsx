import React from 'react';
import Node, { Field } from '../Node';
import { LayoutTemplate } from '@tamagui/lucide-icons';
import { useNodeColor } from '../diagram/Theme';
import { DumpType, PORT_TYPES, dumpConnection } from '../lib/Node';

const TemplateExpression = (node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const nodeParams: Field[] = [
        { label: 'Template', field: 'value', type: 'input' },
    ]

    return (
        <Node icon={LayoutTemplate} node={node} isPreview={!id} title={"template"} id={id} params={nodeParams} color={color} />
    );
}
TemplateExpression.category = "operators"
TemplateExpression.keywords = ["Template"]
TemplateExpression.getData = (node, data, edges) => {
    return {
        value: node.getText().slice(1, -1)
    }
}

TemplateExpression.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level = 0) => {
    const data = nodesData[node.id];
    let expression = dumpConnection(node, "target", "value", PORT_TYPES.data, data?.value ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)

    return '`' + expression + '`'
}

TemplateExpression.skipTraversal = true //skip this node childrens

export default React.memo(TemplateExpression)

