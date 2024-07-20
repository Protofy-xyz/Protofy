import { Node, NodeParams, getFieldValue, Button } from 'protoflow';
import { Mail } from '@tamagui/lucide-icons';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme'
// import { sendMailWithResend } from 'protonode';

const SendMailResend = (node: any = {}, nodeData = {}) => {
    const color = useColorFromPalette(9)
    let from = getFieldValue("param-1", nodeData);
    let to = getFieldValue("param-2", nodeData);
    let subject = getFieldValue("param-3", nodeData);
    let body = getFieldValue("param-4", nodeData);

    return (
        <Node icon={Mail} node={node} isPreview={!node.id} title='Send Mail (Resend)' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'from', field: 'param-1', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'to', field: 'param-2', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'subject', field: 'param-3', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'body', field: 'param-4', type: 'input' }]} />
            {/* {
                (from && to && subject && body) ?
                    <Button label="Send Mail" onPress={async () => {
                        await sendMailWithResend(from, to, subject, body)
                    }} />
                    : null
            } */}
        </Node>
    )
}

export default {
    id: 'SendMailResend',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && (nodeData.to == 'context.sendMailWithResend')
        )
    },
    category: "api",
    keywords: ["api", "rest", "http", "automation", "email", "mail", "sendMail", "resend"],
    getComponent: SendMailResend,
    getInitialData: () => { return { to: 'context.sendMailWithResend', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "", kind: "StringLiteral" }, "param-3": { value: "", kind: "StringLiteral" }, "param-4": { value: "", kind: "StringLiteral" }, await: true } }
}