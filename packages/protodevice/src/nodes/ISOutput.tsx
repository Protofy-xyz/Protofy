import React from "react";
import {Node, Field, HandleOutput, NodeParams } from '../../flowslib';
import { Box, Text, Icon} from "native-base";


const ISOutput = (node: any = {}, nodeData = {}, children) => {

    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param1', type: 'input', pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str.toLowerCase() + '"' },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='IS Output' color="#2e9348" id={node.id} skipCustom={true} disableInput disableOutput>
            <Box marginY={'20px'} alignSelf="center">
                <img src={require('../../../assets/deviceassets/industrialShields.jpeg')} style={{width:"120px"}} />
            </Box>
            <NodeParams id={node.id} params={nodeParams} />            
        </Node>
    )
}

export default ISOutput