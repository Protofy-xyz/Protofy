import React, { memo } from 'react';
import Node, { Field } from '../Node';
import { useNodeColor } from '../diagram/Theme';

const SetNode = (node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const nodeParams: Field[] = [
        { label: 'From', field: 'from', type: 'input', description: 'Identifier name. Leave empty to access current scope' },
        { label: 'Key', field: 'key', type: 'input' },
        { label: 'Value', field: 'value', type: 'input' }
    ]

    return (
        <Node node={node} isPreview={!id} title='Set' id={id} params={nodeParams} color={color}/>
    );
}

export default memo(SetNode)