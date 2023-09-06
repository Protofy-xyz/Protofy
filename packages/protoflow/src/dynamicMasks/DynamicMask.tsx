import React from 'react';
import Node, { FlowPort, NodeParams } from '../Node';
import { MdOutlineComment } from "react-icons/md";
import FallbackPort from '../FallbackPort';
import Button from '../Button';

const DynamicMask = (node: any = {}, nodeData = {}, topics, mask) => {
    const [result, setResult] = React.useState("")
    return (
        <Node icon={MdOutlineComment} node={node} isPreview={!node.id} title={mask.data.title} id={node.id} color="#BCAAA4" skipCustom={true}>
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
                            {result && element.params.displayResult?<>
                                <textarea style={{width:"100%", height: "150px", fontSize: "20px"}}>{JSON.stringify(result)}</textarea>
                            </>:null}
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