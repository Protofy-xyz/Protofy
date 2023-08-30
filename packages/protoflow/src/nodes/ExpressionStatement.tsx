import React, { memo } from 'react';
import { getId } from '../lib/Node';

const ExpressionStatement = (node) => {
    const { id, type } = node
    return (
        <></>
    );
}

ExpressionStatement.getData = (node, data, edges) => {
    const initializer = node.getExpression()
    if (initializer) {
        return data[getId(initializer)]
    } else {
        return { type: 'data', value: '' }
    }
}

ExpressionStatement.isShadow = (node, data, mode, edges) => {
    return true
} 
export default memo(ExpressionStatement)