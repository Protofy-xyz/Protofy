import React from "react";
import {Node, Field, NodeParams } from '../../flowslib';
import NodeBus, { cleanName, generateTopic } from "../NodeBus";

const ClimateIR = (node: any = {}, nodeData = {}, children) => {
    const [name,setName] = React.useState(cleanName(nodeData['param1']))
    const nameErrorMsg = 'Reserved name'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param1', type: 'input', onBlur:()=>{setName(cleanName(nodeData['param1']))}, pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str.toLowerCase() + '"',
            error: nodeData['param1']?.replace(/['"]+/g, '') == 'climateir' ? nameErrorMsg : null
        },
        {
            label: 'Protocol', static: true, field: 'param2', type: 'select',
            data: [
            'aux', 
            '"ballu"', 
            '"carrier_mca"', 
            '"carrier_nqv"', 
            "daikin_arc417", 
            '"daikin_arc480"', 
            '"daikin"', 
            '"electroluxyal"', 
            '"fuego"', 
            '"fujitsu_awyz"', 
            '"gree"', 
            '"greeya"', 
            '"greeyac"', 
            '"greeyan"', 
            '"hisense_aud"', 
            '"hitachi"', 
            '"hyundai"', 
            '"ivt"', 
            '"midea"', 
            '"mitsubishi_fa"', 
            '"mitsubishi_fd"', 
            '"mitsubishi_fe"', 
            '"mitsubishi_heavy_fdtc"', 
            '"mitsubishi_heavy_zj"', 
            '"mitsubishi_heavy_zm"', 
            '"mitsubishi_heavy_zmp"', 
            '"mitsubishi_heavy_kj"',
            '"mitsubishi_msc"', 
            '"mitsubishi_msy"', 
            '"mitsubishi_sez"', 
            '"panasonic_ckp"', 
            '"panasonic_dke"', 
            '"panasonic_jke"', 
            '"panasonic_lke"', 
            '"panasonic_nke"', 
            '"samsung_aqv"', 
            '"samsung_fjm"', 
            '"sharp"', 
            '"toshiba_daiseikai"', 
            '"toshiba"',
            '"zhlt01"']
        },
        {
            label: 'Horizontal default', static: true, field: 'param3', type: 'select',
            data: ['"left"', '"mleft"', '"middle"', '"mright"', '"right"', '"auto"']
        },
        {
            label: 'Vertical default', static: true, field: 'param4', type: 'select',
            data: ['"left"', '"mleft"', '"middle"', '"mright"', '"right"', '"auto"']
        },
        { label: 'Max temperature', static: true, field: 'param5', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str + '"' },
        { label: 'Min temperature', static: true, field: 'param6', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str + '"' },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Climate IR' color="#E0EEEE" id={node.id} skipCustom={true} >
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default ClimateIR