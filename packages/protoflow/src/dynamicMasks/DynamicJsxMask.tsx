import React from 'react';
import Node, { Field, FlowPort, NodeParams } from '../Node';
import { IoCodeSharp } from 'react-icons/io5';
import FallbackPort from '../FallbackPort';
import AddPropButton from '../AddPropButton';

const DynamicJsxMask = (node: any = {}, nodeData = {}, topics, mask) => {
    const propsArray: Field[] = Object.keys(nodeData).filter((p) => p.startsWith('prop-')).map((prop: any, i) => {
        return { label: prop.substr(5), field: prop, fieldType: 'prop', deleteable: true } as Field
    })
    return (
        <Node icon={IoCodeSharp} node={node} isPreview={!node.id} title={mask.data.title} id={node.id} color="#C5E1A5" skipCustom={true}>
            {
                mask.data.body.map(element => {
                    switch (element.type) {
                        case 'child': {
                            return <NodeParams id={node.id} params={element.child} />
                        }
                        case 'prop': {
                            const redirectProp = mask.data.body.find(e => e.type == 'redirect');
                            const redirectPropName = redirectProp?.params?.port;
                            return <>
                                <NodeParams id={node.id} params={element.prop} />
                                <NodeParams id={node.id} params={propsArray.filter(item => !element.prop.find(i => i.field == item.field) && (item.field != redirectPropName))} />
                                <AddPropButton id={node.id} type="Prop" nodeData={nodeData} />
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
                    }
                })
            }
        </Node>
    )
}

DynamicJsxMask.check = (node, nodeData, data) => {
    var initialCheck = false
    if (data.initialData) {
        var initialDataArr = data.body?.find(b => b.type == 'prop')?.prop?.map(i => i?.field)
        var dataArr = Object.keys(nodeData)
        initialCheck = initialDataArr?.filter(i => !dataArr.includes(i)).length == 0 ? true : false
    }
    let result = node.type == data.type && nodeData.name == data.id && initialCheck
    return result;
}

export default DynamicJsxMask