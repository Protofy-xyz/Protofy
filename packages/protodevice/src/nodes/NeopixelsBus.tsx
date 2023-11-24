import React from "react";
import {Node, Field, NodeParams } from 'protoflow';

const NeopixelsBus = (node: any = {}, nodeData = {}, children) => {
    const transitionErrorMsg = 'Add units s/ms'

    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param1', type: 'input'},
        { label: '#LEDS', static: true, field: 'param2', type: 'input' },
        {
            label: 'RGB Order', static: true, field: 'param3', type: 'select',
            data: ['"GRB"', '"GBR"', '"BGR"', '"BRG"', '"RGB"', '"RBG"', '"GRBW"', '"GBRW"', '"BGRW"', '"BRGW"', '"RGBW"', '"RBGW"']
        },
        {
            label: 'Chipset', static: true, field: 'param4', type: 'select',
            data: ['"800KBPS"', '"400KBPS"', '"400KBPS"', '"WS2811"', '"WS2812X"', '"WS2812"', '"SK6812"', '"TM1814"', '"TM1829"', '"TM1914"', '"APA106"', '"LC8812"']
        },
        {
            label: 'Restore Mode', static: true, field: 'param5', type: 'select',
            data: ['"RESTORE_DEFAULT_OFF"', '"RESTORE_DEFAULT_ON"', '"RESTORE_INVERTED_DEFAULT_OFF"', '"RESTORE_INVERTED_DEFAULT_ON"', '"RESTORE_AND_OFF"', '"RESTORE_AND_ON"', '"ALWAYS_OFF"', '"ALWAYS_ON"']
        },
        {
            label: 'Default transition', static: true, field: 'param6', type: 'input',
            error: !['s', 'ms'].includes(nodeData['param6']?.replace(/['"0-9]+/g, '')) ? transitionErrorMsg : null
        },
        { 
            label: 'Channel', static: true, field: 'param7', type: 'select' ,
            data: ['0', '1', '2', '3', '4', '5', '6', '7']
        },
        {
            label: 'Pulse', static: true, field: 'param8', type: 'boolean'
        },
        {
            label: 'Random', static: true, field: 'param9', type: 'boolean'
        },
        {
            label: 'Strobe', static: true, field: 'param10', type: 'boolean'
        },
        {
            label: 'Flicker', static: true, field: 'param11', type: 'boolean'
        },
        {
            label: 'Adressable Rainbow', static: true, field: 'param12', type: 'boolean'
        },
        {
            label: 'Adressable Color Wipe', static: true, field: 'param13', type: 'boolean'
        },
        {
            label: 'Adressable Scan', static: true, field: 'param14', type: 'boolean'
        },
        {
            label: 'Adressable Twinkle', static: true, field: 'param15', type: 'boolean'
        },
        {
            label: 'Adressable Random Twinkle', static: true, field: 'param16', type: 'boolean'
        },
        {
            label: 'Adressable Fireworks', static: true, field: 'param17', type: 'boolean'
        },
        {
            label: 'Adressable Flicker', static: true, field: 'param18', type: 'boolean'
        },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Neopixels' color="#C5E1A4" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default NeopixelsBus
