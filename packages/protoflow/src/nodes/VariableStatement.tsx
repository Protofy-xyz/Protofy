import React, { memo } from 'react';
import { getId } from '../lib/Node';

const VariableStatement = (node) => {
    const { id, type } = node
    return (
        <></>
    );
}

VariableStatement.getData = (node, data, edges) => {
    const initializer = node.getDeclarationList()
    if (initializer) {
        return data[getId(initializer)]
    } else {
        return { type: 'data', value: '' }
    }
}

VariableStatement.isShadow = (node, data, mode, edges) => {
    return true
} 

export default memo(VariableStatement)