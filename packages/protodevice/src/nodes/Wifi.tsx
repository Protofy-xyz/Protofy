import { Node, Field, HandleOutput, NodeParams } from 'protoflow';

const Wifi = (node:any={}, nodeData={}, children) => {

    const nodeParams: Field[] = [
        { label: 'SSID', field: 'param1', type: 'input', static: true },
        { label: 'Password', field: 'param2', type: 'input', static: true },
        {
            label: 'Power mode', field: 'param3', type: 'select', static: true,
            data: ['"none"', '"light"', '"high"'],
        }
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
        <Node node={node} isPreview={!node.id} title='Wifi' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default Wifi