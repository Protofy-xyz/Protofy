import { Node, NodeParams, getFieldValue } from 'protoflow';
import { Mail } from '@tamagui/lucide-icons';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import NodeText from 'protoflow/src/diagram/NodeText';
import {Link} from 'protolib/components/Link';

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
            <NodeText
                style={{ width: 'fit-content', height: 'fit-content', marginBottom: '15px' }}
            ><Link href="keys">Generate a MAIL_RESEND_TOKEN key</Link>.
            </NodeText>
        </Node>
    )
}

export default {
    id: 'SendMailResend',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && (nodeData.to == 'context.resend.sendMailWithResend')
        )
    },
    category: "api",
    keywords: ["api", "rest", "http", "automation", "email", "mail", "sendMail", "resend"],
    getComponent: SendMailResend,
    getInitialData: () => { return { to: 'context.resend.sendMailWithResend', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "", kind: "StringLiteral" }, "param-3": { value: "", kind: "StringLiteral" }, "param-4": { value: "", kind: "StringLiteral" }, await: true } }
}
