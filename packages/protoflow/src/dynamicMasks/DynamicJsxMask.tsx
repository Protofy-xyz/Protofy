import React from 'react';
import Node, { Field, FlowPort, NodeParams } from '../Node';
import FallbackPort from '../FallbackPort';
import AddPropButton from '../AddPropButton';
import { Code } from 'lucide-react'
import { getProtolibParams, getProtolibProps } from './ProtolibProps';
import AlignmentType, { getAlignmentProps } from './AlignmentType';
// import ColorType, { getColorProps } from './ColorType';

const DynamicJsxMask = (node: any = {}, nodeData = {}, topics, mask) => {
    const propsArray: Field[] = Object.keys(nodeData).filter((p) => p.startsWith('prop-')).map((prop: any, i) => {
        return { label: prop.substr(5), field: prop, fieldType: 'prop', deleteable: true } as Field
    })
    
    return (
        <Node icon={Code} node={node} isPreview={!node.id} title={mask.data.title} id={node.id} color="#C5E1A5" skipCustom={true}>
            {
                mask.data.body.map(element => {
                    switch (element.type) {
                        case 'child': {
                            const childs: Field[] = Object.keys(nodeData).filter((p) => p.startsWith('child-')).map((prop: any, i) => {
                                const dynamicMask = element.child?.find(c => c.field === prop)
                                return { label: dynamicMask ? dynamicMask.label : ('Child' + (i + 1)), field: prop, fieldType: 'child', deleteable: dynamicMask ? false : true } as Field
                            })
                            return <>
                                <NodeParams id={node.id} params={childs} />
                                {!element.disableAdd ? <AddPropButton id={node.id} type="Child" nodeData={nodeData} /> : null}
                            </>
                        }
                        case 'prop': {
                            const redirectProp = mask.data.body.find(e => e.type == 'redirect');
                            const redirectPropName = redirectProp?.params?.port;
                            const hasProtolibProps = mask.data.body.find(i => i.type == 'protolibProps')
                            const protolibProps = getProtolibProps()
                            return <>
                                <NodeParams id={node.id} params={element.prop} />
                                <NodeParams
                                    id={node.id}
                                    params={propsArray.filter(p => !protolibProps.includes(p.field) || !hasProtolibProps)
                                        .filter(item => !element.prop.find(i => i.field == item.field) && (item.field != redirectPropName))
                                    }
                                />
                                {!element.disableAdd ? <AddPropButton id={node.id} type="Prop" nodeData={nodeData} /> : null}
                            </>
                        }
                        case 'spacer': {
                            return <div style={{ marginBottom: element.params.height }}></div>
                        }
                        case 'output': {
                            return <FlowPort id={node.id} type='output' label={element.params.label} style={element.params.style ?? {}} handleId={element.params.handleId} />
                        }
                        case 'redirect': {
                            return <FallbackPort node={node} port={element.params.port} type={"target"} fallbackPort={element.params.fallbackPort} portType={"_"} preText={element.params.preText} postText={element.params.postText} />
                        }
                        case 'protolibProps': {
                            // const colorProps = getColorProps()
                            const alignmentProps = getAlignmentProps()

                            return <>
                                {/* {
                                    element.props.filter(p => colorProps.includes(p))?.map(field => (
                                        <ColorType node={node} field={field} nodeData={nodeData} />
                                    ))
                                } */}
                                {
                                    element.props.filter(p => alignmentProps.includes(p))?.map(field => (
                                        <AlignmentType node={node} field={field} nodeData={nodeData} />
                                    ))
                                }
                                <NodeParams id={node.id} params={getProtolibParams(element.props)} />
                            </>
                        }
                    }
                })
            }
        </Node >
    )
}

DynamicJsxMask.check = (node, nodeData, data) => {
    var initialCheck = false
    if (data.initialData) {
        var initialDataArr = data.body?.find(b => b.type == 'prop')?.prop?.map(i => i?.field)
        var dataArr = Object.keys(nodeData)
        initialCheck = initialDataArr?.filter(i => !dataArr.includes(i)).length == 0 ? true : false
    }
    else {
        initialCheck = true
    }
    let result = node.type == data.type && nodeData.name == data.id && initialCheck
    return result;
}

export default DynamicJsxMask