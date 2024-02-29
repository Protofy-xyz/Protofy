import React, { useContext, useEffect } from 'react';
import Node, { FlowPort, NodeParams } from '../Node';
import FallbackPort from '../FallbackPort';
import Button from '../Button';
import Link from '../Link';
import { MessageSquare } from 'lucide-react'
import { FlowStoreContext } from '../store/FlowsStore';
import NodeSelect from '../diagram/NodeSelect';
import { CustomField } from '../fields';

const DynamicMask = (node: any = {}, nodeData = {}, topics, mask) => {
    const [result, setResult] = React.useState("")
    const [apiRes, setApiRes] = React.useState()

    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)

    // TODO: Refactor api case
    const apiType = mask.data.body.find(e => e.type == 'api')
    if (apiType) {
        useEffect(() => {
            const apiUrl = apiType.data.apiUrl
            fetch(apiUrl).then(response => response.json())
                .then(data => {
                    setApiRes(data)
                })
        }, [])
    }

    return (
        <Node icon={MessageSquare} node={node} isPreview={!node.id} title={mask.data.title} id={node.id} color="#BCAAA4" skipCustom={true}>
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
                            const apiList = apiRes?.map(a => ({ label: a.path, value: `"` + a.path + `"` })) ?? []
                            const field = element.data.field
                            const fieldValue = nodeData[field]
                            const onChangeSelect = (data) => {
                                setNodeData(node.id, { ...nodeData, [field]: data.value })
                            }
                            console.log('DEV: fieldValue: ', { fieldValue, apiList })
                            return <>
                                <CustomField label={element.data.label} input={
                                    apiList.length && fieldValue ? <NodeSelect
                                        onChange={onChangeSelect}
                                        defaultValue={{
                                            value: fieldValue,
                                            label: fieldValue
                                        }}
                                        options={apiList}
                                    /> : <></>
                                } />
                            </>
                        }
                        case 'link': {
                            return <>
                                <Link target="_blank" href={element.data.url}>{element.data.text}</Link>
                            </>
                        }
                        case 'button': {
                            return <>
                                <Button onPress={async () => {
                                    const func = new Function('data', `
                                    return (async () => {
                                        ${element.params.onPress}
                                    })();
                                `);
                                    const result = await func(nodeData)
                                    setResult(result)
                                    console.log("result: ", result)
                                }} label={element.params.label}></Button>
                                {result && element.params.displayResult ? <>
                                    <textarea style={{ width: "100%", height: "150px", fontSize: "20px" }}>{JSON.stringify(result)}</textarea>
                                </> : null}
                            </>
                        }
                    }
                })
            }
        </Node>
    )
}

DynamicMask.check = (node, nodeData, data) => {
    let result = node.type == data.type && (new RegExp(data.filter.to)).test(nodeData.to);
    for (let i = 0; data.filter.params && result && i < data.filter.params.length; i++) {
        result = (new RegExp(data.filter.params[i])).test(nodeData['param' + (i + 1)]);
    }
    return result;
}

export default DynamicMask