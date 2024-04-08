import { Node, Field, HandleOutput, NodeParams } from 'protoflow';
import { getColor } from '.';

const Wifi = ({ node = {}, nodeData = {}, children, color }: any) => {

    const nodeParams: Field[] = [
        { label: 'SSID', field: 'param-1', type: 'input', static: true },
        { label: 'Password', field: 'param-2', type: 'input', static: true },
        {
            label: 'Power mode', field: 'param-3', type: 'select', static: true,
            data: ["none", "light", "high"],
        }
    ] as Field[]

    // const [state,setState] = useState("Not detected");
    // const { message } = useSubscription(['newplatform/mydevice/switch/light/state']);
    // console.log("node: ",nodeData["param-1"])
    // useEffect(()=>{
    //     console.log("message", message)
    // },[message])
    // const subsystemData = getSubsystem()
    // const type = 'switch';
    return (
        <Node node={node} isPreview={!node.id} title='Wifi' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'Wifi',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('wifi'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <Wifi color={getColor('Wifi')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'wifi', "param-1": { value: "SSID", kind: "StringLiteral" }, "param-2": { value: "PASSWORD", kind: "StringLiteral" }, "param-3": { value: "none", kind: "StringLiteral" } } }
}