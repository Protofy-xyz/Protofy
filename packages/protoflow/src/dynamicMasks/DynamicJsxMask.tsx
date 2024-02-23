import React from 'react';
import Node, { Field, FlowPort, NodeParams } from '../Node';
import FallbackPort from '../FallbackPort';
import AddPropButton from '../AddPropButton';
import { Code } from 'lucide-react'
import { CustomFieldType, getCustomFields } from '../fields';

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
                                const dynamicMask = element.data?.find(c => c.field === prop)
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
                            const hasCustomProps = mask.data.body.find(i => i.type == 'custom-field')
                            const customProps = getCustomFields(mask.data.body)

                            return <>
                                <NodeParams id={node.id} params={element.data} />
                                <NodeParams
                                    id={node.id}
                                    params={propsArray.filter(p => !customProps.includes(p.field) || !hasCustomProps)
                                        .filter(item => !element.data.find(i => i.field == item.field) && (item.field != redirectPropName))
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
                        case 'custom-field': {
                            return <>
                                {
                                    element.data.map((item, index) => <CustomFieldType key={index} item={item} node={node} nodeData={nodeData} />)
                                }
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
        var initialDataArr = data.body?.find(b => b.type == 'prop')?.props?.map(i => i?.field)
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