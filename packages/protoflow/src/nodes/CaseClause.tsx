import React, { memo } from 'react';
import { getId } from '../lib/Node';

const CaseClause = (node) => {
    const { id, type } = node
    return (
        <></>
    );
}

CaseClause.getData = (node, data, edges) => {
    const initializer = node.getExpression()
    if (initializer) {
        return data[getId(initializer)]
    } else {
        return { type: 'data', value: '' }
    }
}
CaseClause.category = 'conditionals'

//disables node creation, even if this component exist.
//this allows to have 'getData', but CaseClause doesn't exists at diagram level
//it only exists for linking purposes.
CaseClause.isShadow = (node, data, mode, edges) => {
    return true
} 

export default memo(CaseClause)