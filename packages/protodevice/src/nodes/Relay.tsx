import React, {useEffect, useState} from "react";
import { Node, Field, HandleOutput, NodeParams } from 'protoflow';
import { useMqttState  } from 'mqtt-react-hooks';

const Relay = (node:any={}, nodeData={}, children) => {
    const publishMqtt = (state, name)=>{
        console.log({state,name})
        client.publish('newplatform/mydevice/switch/'+name+'/command', state);
    }
    const nodeParams: Field[] = [
        { label: 'Name', static:true, field: 'param1', type: 'input'},
        { label: 'Restore Mode', static:true, field: 'param2', type: 'select', data:['"ALWAYS_ON"', '"ALWAYS_OFF"'] }
    ] as Field[]
    const { client } = useMqttState();
    // const [state,setState] = useState("Not detected");
    // const { message } = useSubscription(['newplatform/mydevice/switch/light/state']);
    // console.log("NOOOOOOOODE: ",nodeData["param1"])
    // useEffect(()=>{
    //     console.log("AAAAAAAAAAAAAAAAAA", message)
    // },[message])
    return (
        <Node node={node} isPreview={!node.id} title='GPIO Switch' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
            {/* {message?
                message.message?<p>{message?.message.toString()}</p>:<p>Not detected</p>:<></>
            } */}<div style={{marginTop: "10px", marginBottom: "10px"}}>
            <button onClick={()=>{publishMqtt("ON",nodeData["param1"].replaceAll('"',''))}} style={{border:"1px solid #cccccc",borderRadius:"5px", marginRight: "5px", padding:"10px"}}>ON</button>
            <button onClick={()=>{publishMqtt("OFF",nodeData["param1"].replaceAll('"',''))}} style={{border:"1px solid #cccccc",borderRadius:"5px", marginLeft: "5px", padding:"10px"}}>OFF</button>
            </div>
        </Node>
    )
}

export default Relay