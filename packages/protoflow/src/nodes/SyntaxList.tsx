import React, { memo } from 'react';
import { connectNodes } from '../lib/Edge';
import { getId, PORT_TYPES, DumpType } from '../lib/Node';

const SyntaxList = (node) => {
    const { id, type } = node
    return (
        <></>
    );
}

SyntaxList.getData = (node, data, edges) => {
    //connect all children in a line
    const statements = node.getStatements? node.getStatements() : node.getDeclarations()
    // console.log('SyntaxList: ', statements, statements.length)
    statements.forEach((statement, i) => {
        if(i < statements.length-1) {
            const source = data[getId(statement)]
            const target = data[getId(statements[i+1])]
            if(source.type == 'node' && target.type == 'node') {
                const sourceId = source.value.id
                const targetId = target.value.id
                // console.log('before: ', edges)
                edges.push(connectNodes(sourceId, `${sourceId}${PORT_TYPES.flow}output`,  targetId, `${targetId}${PORT_TYPES.flow}input`))
                
                // console.log('after: ',edges)
            }

        }
        // console.log(data[getId(statement)], i)
    })
    return data[getId(statements[0])]
}

SyntaxList.isShadow = (node, data, mode, edges) => {
    return true
} 

export default memo(SyntaxList)