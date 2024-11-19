import { Node, NodeParams, getFieldValue, filterObject, restoreObject, restoreCallback, filterCallback, FallbackPortList } from 'protoflow';
import { useState, useEffect, useRef } from 'react';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Play } from '@tamagui/lucide-icons';
import { WledRepository } from '../repositories/wledRepository';
import { CustomFieldType } from 'protoflow/src/fields';


const WledAction = (node: any = {}, nodeData = {}) => {
    const ipAdress = getFieldValue('param-1', nodeData);
    const [effects, setEffects] = useState<any[]>([]);
    const [palettes, setPalettes] = useState<any[]>([]);
    const [segments, setSegments] = useState<any[]>([]);
    const paramsRef = useRef();

    const wledRepository = new WledRepository(ipAdress);

    const isArray = (data) => {
        return Array.isArray(data);
    }

    const getEffects = async () => {
        const data = await wledRepository.listEffects();
        isArray(data) && setEffects(data.map((effect, i) => ({ label: effect, value: i })))
    };

    const getPalettes = async () => {
        const data = await wledRepository.listPalettes();
        isArray(data) && setPalettes(data.map((palette, i) => ({ label: palette, value: i })))
    };

    const getSegments = async () => {
        const data = await wledRepository.listSegments();
        isArray(data) && setSegments(data.map(segment => segment?.id));
    }

    const nodeColor = useColorFromPalette(3);

    useEffect(() => {
        if (ipAdress) {
            getSegments();
            getEffects();
            getPalettes();
        }
    }, [ipAdress]);

    return (
        <Node icon={Play} node={node} isPreview={!node.id} title="WLED Action" color={nodeColor} id={node.id} skipCustom={true} >
            <div ref={paramsRef}>
                <NodeParams
                    id={node.id}
                    params={[
                        { label: 'IP Address', field: 'param-1', type: 'input' },
                        { label: 'On', field: 'mask-on', type: 'boolean', defaultValue: true },
                        { label: 'Segment', field: 'mask-segment', type: 'select', data: segments, isDisabled: !segments.length },
                        { label: 'Brightness', field: 'mask-brightness', type: 'input', inputType: 'number', defaultValue: 100, description: '0-255' },
                        { label: 'Speed', field: 'mask-speed', type: 'input', inputType: 'number', description: '0-255' },
                        { label: 'Intensity', field: 'mask-intensity', type: 'input', inputType: 'number', description: '0-255' },
                        { label: 'Effect', field: 'mask-effect', type: 'select', data: effects, isDisabled: !effects.length, deleteable: true },
                        { label: 'Palette', field: 'mask-palette', type: 'select', data: palettes, isDisabled: !palettes.length, deleteable: true },
                        { label: 'Color', field: 'mask-color', type: 'colorPicker', deleteable: true }
                    ]}
                />
            </div>
            <FallbackPortList
                height={'70px'}
                startPosX={500}
                node={node}
                fallbacks={[{
                    "name": "ondone",
                    "label": "onDone(data)",
                    "field": "param-3",
                    "preText": "async (data) => ",
                    "postText": "",
                    "fallbackText": "null"
                }, {
                    "name": "onerror",
                    "label": "OnError (error)",
                    "field": "param-4",
                    "preText": "async (error) => ",
                    "fallbackText": "null",
                    "postText": ""
                }]}
            />
        </Node>
    );
};

export default {
    id: 'WledAction',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return node.type === 'CallExpression' && nodeData.to === 'context.wledAction';
    },
    category: 'IoT',
    keywords: ['action', 'automation', 'esp32', 'device', 'iot', 'wled'],
    getComponent: WledAction,
    filterChildren: (node, childScope, edges, nodeData, setNodeData) => {

        childScope = filterObject({
            skipArrow: false,
            port: 'param-2',
            keys: {
                "mask-on": 'output',
                "mask-segment": 'output',
                "mask-brightness": 'output',
                "mask-speed": 'output',
                "mask-intensity": 'output',
                "mask-effect": 'output',
                "mask-palette": 'output',
                "mask-color": 'output',
            },
        })(node, childScope, edges, nodeData, setNodeData)

        childScope = filterCallback("3", "ondone")(node, childScope, edges)
        childScope = filterCallback("4", "onerror")(node, childScope, edges)
        return childScope;
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges, nodeData) => {

        let resultObj: any = restoreObject({
            port: 'param-2',
            keys: {
                "mask-on": 'output',
                "mask-segment": 'output',
                "mask-brightness": 'output',
                "mask-speed": 'output',
                "mask-intensity": 'output',
                "mask-effect": 'output',
                "mask-palette": 'output',
                "mask-color": 'output',
            }
        })(node, nodes, originalNodes, edges, originalEdges, nodeData);

        let result = restoreCallback("3")(node, nodes, originalNodes, edges, originalEdges);
        result = restoreCallback("4")(node, result.nodes, originalNodes, result.edges, originalEdges);

        const assembledEdges = [...result.edges, ...resultObj.edges]
        const assembledNodes = [...result.nodes, ...resultObj.nodes]

        const filteredEdges = assembledEdges.filter((edge, index, self) =>
            index === self.findIndex(e => e.id === edge.id)
        );

        const filteredNodes = assembledNodes.filter((node, index, self) =>
            index === self.findIndex(n => n.id === node.id)
        );

        return { ...resultObj, ...result, nodes: filteredNodes, edges: filteredEdges };
    },
    getInitialData: () => {
        return {
            to: "context.wledAction",
            "param-1": { value: "", kind: "StringLiteral" },
            "mask-on": { value: true, kind: "BooleanLiteral" },
            "mask-segment": { value: 0, kind: "NumericLiteral" },
            "mask-brightness": { value: 100, kind: "NumericLiteral" },
            "mask-speed": { value: 200, kind: "NumericLiteral" },
            "mask-intensity": { value: 200, kind: "NumericLiteral" },
            "mask-effect": { value: 0, kind: "NumericLiteral" },
            "mask-palette": { value: 0, kind: "NumericLiteral" },
            "param-3": { value: "null", kind: "Identifier" },
            "param-4": { value: "null", kind: "Identifier" },
            await: true,
        };
    },
};