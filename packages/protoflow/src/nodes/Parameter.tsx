import React, { memo } from 'react';
import { getId } from '../lib/Node';

const Parameter = (node) => {
    const { id, type } = node
    return (
        <></>
    );
}

Parameter.getData = (node, data, edges) => {
    const initializer = node.getInitializer()
    if (initializer) {
        return data[getId(initializer)]
    } else {
        return { type: 'data', value: '' }
    }
}

Parameter.isShadow = (node, data, mode, edges) => {
    return true
} 

export default memo(Parameter)