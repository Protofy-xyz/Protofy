import React, { memo, useContext } from 'react';
import { dumpConnection, connectItem, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field, NodeParams } from '../Node';
import { FlowStoreContext } from "../store/FlowsStore";
import AddPropButton from '../AddPropButton';
import { SyntaxKind } from "ts-morph";
import { Code } from 'lucide-react';
import { DEV_WIP_GM } from '../toggles';
import CreateMaskButton from '../CreateMaskButton';
import { useNodeColor } from '../diagram/Theme';

export const JsxElementFactory = (JsxType) => {
    const isSelfClosingElement = JsxType == 'JsxSelfClosingElement'

    const component = (node) => {
        const { id, type } = node
        const useFlowsStore = useContext(FlowStoreContext)
        const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
        const color = useNodeColor(type)
        const name = [
            { label: 'TagName', static: true, field: 'name', type: 'input', description: 'JsxElement name' },
        ] as Field[]

        const props: Field[] = Object.keys(nodeData).filter((p) => p.startsWith('prop-')).map((prop: any, i) => {
            return { label: prop.substr(5), field: prop, fieldType: 'prop', deleteable: true } as Field
        })

        const childs: Field[] = Object.keys(nodeData).filter((p) => p.startsWith('child-')).map((prop: any, i) => {
            return { label: 'Child' + (i + 1), field: prop, fieldType: 'child', deleteable: true } as Field
        })

        const nodeParamsProps: Field[] = name.concat(props)
        const nodeParamsChilds: Field[] = childs

        return (
            <Node headerContent={<div>hello</div>} icon={Code} node={node} isPreview={!id} title={"<x ...></x>"} id={id} color={color}>
                {
                    DEV_WIP_GM && <CreateMaskButton nodeData={nodeData} maskType='JsxElement' />
                }
                <NodeParams id={id} params={nodeParamsProps} />
                <AddPropButton id={id} nodeData={nodeData} type={"Prop"} />
                <NodeParams id={id} params={nodeParamsChilds} />
                <AddPropButton id={id} nodeData={nodeData} type={"Child"} />
            </Node>
        );
    }
    component.category = 'react'
    component.keywords = ["jsx", "jsxelement", "react", "tsx", "fragment", "selfclosed"]
    component.getData = (node, data, nodesData, edges) => {

        // const tagName = { name: node?.getTagNameNode()?.getText() }
        const tagName = { name: isSelfClosingElement ? node?.getTagNameNode()?.getText() : node?.getOpeningElement()?.getTagNameNode()?.getText() };
        const jsxAttributes = isSelfClosingElement ? node?.getAttributes() : node?.getOpeningElement()?.getAttributes();

        const props = jsxAttributes?.reduce((obj, attribute, i) => {
            let sourceKey
            let propName
            let attrData

            if (attribute.getKindName() == "JsxSpreadAttribute") {
                propName = 'prop-spreaded-' + i;
                sourceKey = '';
                attrData = {
                    value: attribute.getText()
                }
            } else {
                var initializer = attribute?.getInitializer()
                attrData = getAttributeData(initializer)
                sourceKey = attribute.getNameNode().getText()
                propName = 'prop-' + sourceKey

                if (!attrData) {
                    attrData = {
                        value: connectItem(initializer?.getExpression(), 'output', node, propName, data, nodesData, edges, propName) ?? ''
                    }
                }
            }
            return {
                ...obj,
                [propName]: {
                    key: sourceKey ?? '',
                    ...attrData
                }
            }
        }, {})

        const childSyntaxList = node.getChildrenOfKind(SyntaxKind.SyntaxList)[0];
        const children = !isSelfClosingElement ? childSyntaxList.getChildren() : [];
        const jsxChilds = children.filter(c => ['JsxElement', 'JsxSelfClosingElement', 'JsxExpression', 'JsxFragment', 'JsxText'].includes(c.getKindName()) && c.getText())
        const childs = jsxChilds?.reduce((obj, child, i) => {
            const key = `child-${i + 1}`
            return {
                ...obj,
                [key]: connectItem(child, 'output', node, key, data, nodesData, edges, key)
            }
        }, {})

        return { ...tagName, ...props, ...childs }
    }

    component.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level = 0) => {
        const data = nodesData[node.id] ?? {};
        const jsxTagName = data?.name
        const fallbackText = data._fallBack?.reduce((total, fb) => {
            const content = dumpConnection(node, fb.type, fb.fallbackPort, fb.portType, null, edges, nodes, nodesData, metadata, false, 'full')
            if (!content) {
                return total = total + fb.fallbackText + " "
            } else {
                var propKey = fb.port.split('-')[1] ?? fb.port
                return total = total + propKey + "=" + (fb.preText + content + fb.postText) + " "
            }
        }, "") ?? ''
        const fallbackProps = data._fallBack?.map(i => i.port) ?? []
        const props = Object.keys(data).filter(key => key.startsWith('prop-') && !fallbackProps.includes(key)).reduce((total, prop) => {
            let objParam
            if (prop.startsWith("prop-spreaded")) {
                objParam = dumpConnection(node, "target", prop, PORT_TYPES.data, data[prop]?.value ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
            } else {
                let objKey = data[prop]?.key ?? prop.replace('prop-', '')
                let objValue
                const dumpedAttr = dumpAttributeData(data[prop])
                if (dumpedAttr) {
                    objValue = dumpedAttr
                } else {
                    const dumpVal = dumpConnection(node, "target", prop, PORT_TYPES.data, data[prop]?.value ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
                    objValue = dumpVal ? ("{" + dumpVal + "}") : undefined
                }
                objParam = objValue ? `${objKey}=${objValue} ` : `${objKey}`
                if (!objKey) return total
            }
            return total + objParam
        }, "")
        const childs = Object.keys(data).filter(key => key.startsWith('child-')).reduce((total, child) => {
            let childValue = dumpConnection(node, "target", child, PORT_TYPES.data, data[child] ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
            return total + "\t" + childValue + "\n"
        }, "")
        const elementClosing = isSelfClosingElement ? "/>" : `>\n${childs}</${jsxTagName}>`
        return `<${jsxTagName} ` + fallbackText + props + elementClosing + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    }
    return component
}

const JsxElementNode = JsxElementFactory('JsxElement')

export default memo(JsxElementNode)

export function getKindName(value) {
    switch (typeof value) {
        case 'number':
            return 'NumericLiteral'
        case 'string':
            return 'StringLiteral'
        case 'boolean':
            return 'TrueKeyword'
        case 'object':
            return Array.isArray(value) ? 'ArrayLiteralExpression' : 'ObjectLiteralExpression'
    }
}
// TODO: export function to protolib
function dumpAttributeData(attrData: { kind: string, value: any }): any {
    if (!attrData) return
    const expressionKind = attrData.kind
    var value = attrData.value
    switch (expressionKind) {
        case 'StringLiteral':
            return '"' + value + '"'
        case 'NumericLiteral':
        case 'TrueKeyword':
        case 'FalseKeyword':
        case 'Identifier':
            break
        default:
            return
    }
    return "{" + value + "}"
}
// TODO: export function to protolib
function getAttributeData(node: any): any {
    let atrVal
    var attributeKind = node?.getKindName()
    var kind

    switch (attributeKind) {
        case 'StringLiteral':
            atrVal = node?.getLiteralValue();
            kind = attributeKind
            break;
        default: //e.g JsxExpression
            const expression = node?.getExpression()
            kind = expression?.getKindName()

            switch (kind) {
                case 'StringLiteral':
                case 'NumericLiteral':
                case 'TrueKeyword':
                case 'FalseKeyword':
                    atrVal = expression.getLiteralValue()
                    break
                case 'Identifier':
                    atrVal = expression.getText()
                    break
                // case 'ObjectLiteralExpression':
                //     const tmpProps = expression.getProperties().reduce((total, current) => {
                //         var propKey = current.getName()
                //         var propVal
                //         try {
                //             propVal = current.getInitializer()?.getLiteralValue()
                //         } catch (e) {
                //             propVal = current.getInitializer().getText()
                //         }
                //         return {
                //             ...total,
                //             [propKey]: propVal
                //         }
                //     }, {})

                //     atrVal = tmpProps
                //     break
                default:
                    return
            }
            break;
    }
    return { value: atrVal, kind }
}