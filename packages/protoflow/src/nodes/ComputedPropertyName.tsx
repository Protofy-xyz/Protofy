import React, { memo } from 'react';

const ComputedPropertyName = (node) => {
    return (
        <></>
    );
}

ComputedPropertyName.skipTraversal = true //skip this node childrens

export default memo(ComputedPropertyName)