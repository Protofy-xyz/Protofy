import { Node, Field, HandleOutput, NodeParams } from 'protoflow';

const Mqtt = (node:any={}, nodeData={}, children) => {

    const nodeParams: Field[] = [
        { label: 'Broker', field: 'param1', type: 'input', static: true },
    ] as Field[]
    
    // const [state,setState] = useState("Not detected");
    // const { message } = useSubscription(['newplatform/mydevice/switch/light/state']);
    // console.log("NOOOOOOOODE: ",nodeData["param1"])
    // useEffect(()=>{
    //     console.log("AAAAAAAAAAAAAAAAAA", message)
    // },[message])
    // const subsystemData = getSubsystem()
    // const type = 'switch';
    return (
        <Node node={node} isPreview={!node.id} title='Mqtt' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default Mqtt