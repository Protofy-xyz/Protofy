import React, { memo } from 'react';
import Node, { Field } from '../Node';
import { nodeColors } from '.';

const VisualGroup = (node) => {
    console.log('node in visualgroup: ', node)
    const isRoot = node.id.startsWith('VisualGroup_SourceFile_')
    const width = node.data?.width + 'px'
    const height = node.data?.height + 'px'
    const border = '3px'
    const borderColor = 'white'
    return (
        <div style={{ width: '0px', height: '0px' }}>
            {
                node.data?.visible ? <>
                    <div className={'nodrag'} style={{ position: 'absolute', width: width, height: border, backgroundColor: borderColor }} />
                    <div className={'nodrag'} style={{ position: 'absolute', top: height, width: width, height: border, backgroundColor: borderColor }} />
                    <div className={'nodrag'} style={{ position: 'absolute', width: border, height: height, backgroundColor: borderColor }} />
                    <div className={'nodrag'} style={{ position: 'absolute', left: width, width: border, height: height, backgroundColor: borderColor }} />
                </> : null
            }

        </div>
    );
}

export default memo(VisualGroup)