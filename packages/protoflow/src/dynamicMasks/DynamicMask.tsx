import React from 'react';
import Node, { Field, FlowPort, NodeParams } from '../Node';
import FallbackPort from '../FallbackPort';
import Button from '../Button';
import Link from '../Link';
import { MessageSquare, Code } from 'lucide-react'
import { getCustomFields } from '../fields';
import AddPropButton from '../AddPropButton';
import { CustomFieldsList } from '../fields/CustomFieldsList';
import { ApiType } from './dynamicTypes/ApiType';

const Icons = {
    "CallExpression": MessageSquare,
    "JsxElement": Code,
    "JsxSelfClosingElement": Code
}

const DynamicMask = (node: any = {}, nodeData = {}, topics, mask) => {

    return (
        <Node icon={Icons[node.type]} node={node} isPreview={!node.id} title={mask.data.title} id={node.id} skipCustom={true}>
            {
                mask.data.body.map(element => {
                    switch (element.type) {
                        case 'params': {
                            return <NodeParams id={node.id} params={element.params} />
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
                        case 'api': { // TODO: Refactor this type and make it generic
                            return <ApiType element={element} mask={mask} node={node} nodeData={nodeData} />
                        }
                        case 'link': {
                            return <>
                                <Link target="_blank" href={element.data.url}>{element.data.text}</Link>
                            </>
                        }
                        // case 'button': {
                        //     return <>
                        //         <Button onPress={async () => {
                        //             const func = new Function('data', `
                        //             return (async () => {
                        //                 ${element.params.onPress}
                        //             })();
                        //         `);
                        //             const result = await func(nodeData)
                        //             setResult(result)
                        //             console.log("result: ", result)
                        //         }} label={element.params.label}></Button>
                        //         {result && element.params.displayResult ? <>
                        //             <textarea style={{ width: "100%", height: "150px", fontSize: "20px" }}>{JSON.stringify(result)}</textarea>
                        //         </> : null}
                        //     </>
                        // }
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
                            const propsArray: Field[] = Object.keys(nodeData).filter((p) => p.startsWith('prop-')).map((prop: any, i) => {
                                return { label: prop.substr(5), field: prop, fieldType: 'prop', deleteable: true } as Field
                            })

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
                        case 'custom-field': {
                            return <>
                                <CustomFieldsList node={node} nodeData={nodeData} fields={element.data} />
                            </>
                        }
                    }
                })
            }
        </Node>
    )
}

DynamicMask.check = (node, nodeData, data) => {
    var nodeType = node.type

    let result
    var initialCheck = false

    switch (nodeType) {
        case 'JsxElement':
        case 'JsxSelfClosingElement':
            if (data.initialData) {
                var initialDataArr = data.body?.find(b => b.type == 'prop')?.props?.map(i => i?.field)
                var dataArr = Object.keys(nodeData)
                initialCheck = initialDataArr?.filter(i => !dataArr.includes(i)).length == 0 ? true : false
            }
            else {
                initialCheck = true
            }
            result = (node.type == data.type || node.type == "JsxSelfClosingElement") && nodeData.name == data.id && initialCheck
            break;

        case 'CallExpression':
        default:
            result = node.type == data.type && (new RegExp(data.filter.to)).test(nodeData.to);
            for (let i = 0; data.filter.params && result && i < data.filter.params.length; i++) {
                result = (new RegExp(data.filter.params[i])).test(nodeData['param' + (i + 1)]);
            }
            break;
    }
    return result;
}

export default DynamicMask