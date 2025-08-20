import React, { memo } from 'react';

const ComputedPropertyName = (node) => {
    return (
        <></>
    );
}

ComputedPropertyName.skipTraversal = true //skip this node childrens

ComputedPropertyName.isShadow = (node, data, mode, edges) => {
    return true
} 

export default memo(ComputedPropertyName)