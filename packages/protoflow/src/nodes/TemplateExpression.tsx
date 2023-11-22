import React from 'react';
import Node, { Field } from '../Node';
import { nodeColors } from '.';
import { LayoutTemplate } from 'lucide-react';

const TemplateExpression =(node) => {
    const { id, type } = node
    const nodeParams: Field[] = [
        { label: 'Template', field: 'value', type: 'input'},
    ]

    return (
        <Node icon={LayoutTemplate} node={node} isPreview={!id} title={"template"} id={id} params={nodeParams} color={nodeColors[type]}/>
    );
}
TemplateExpression.keyWords = ["Template"]
TemplateExpression.getData = (node, data, edges) => {
    return {
        value: node.getText().slice(1,-1)
    }
}

TemplateExpression.skipTraversal = true //skip this node childrens

export default React.memo(TemplateExpression)

