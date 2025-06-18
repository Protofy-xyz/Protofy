import { API, generateEvent } from "protobase";
import { AutoAPI, handler, getServiceToken } from 'protonode'
import { getLogger } from 'protobase';
import { addAction } from "@extensions/actions/coreContext/addAction";
import { addCard } from "@extensions/cards/coreContext/addCard";


const registerActions = async (context) => {
    addAction({
        group: 'resend',
        name: 'resend-message',
        url: `/api/v1/resend/send/message`,
        tag: "send",
        description: "send a resend email",
        params: { from: "hello@protofy.xyz", to: "protofito@protofy.xyz", subject: "Hello World", html: "<p>Congrats on sending your <strong>first email</strong>!</p>" },
        emitEvent: true,
        token: await getServiceToken()
    })
}

const registerCards = async (context) => {
    addCard({
        group: 'resend',
        tag: "message",
        id: 'resend_message_send',
        templateName: "resend send message",
        name: "message_send",
        defaults: {
            width: 3,
            height: 14,
            name: "resend_message_send",
            icon: "send",
            color: "#25d366",
            description: "send a resend message to a phone number",
            rulesCode: `return execute_action("/api/v1/resend/send/message", { from: userParams.from, to: userParams.to, subject: userParams.subject, html: userParams.html });`,
            params: { from: "email", to: "email", subject: "text", html: "text" },
            type: 'action'
        },
        emitEvent: true,
        token: await getServiceToken()
    })
}

const registerActionsAndCards = async (context) => {
    registerActions(context)
    registerCards(context)
}

export default async (app, context) => {

    app.get('/api/v1/resend/send/message', handler(async (req, res, session) => {
        const { from, to, subject, html } = req.query
        // console.log("phone", phone)
        // console.log("message", message)
        if (!from || !to || !subject || !html) {
            res.status(400).send({ error: `Missing ${from ? 'from' : to ? 'to' : subject ? 'subject' : 'html'}` })
            return;
        }

        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        try {
            await context.resend.sendMailWithResend(from, to, subject, html)
            res.send({ result: "done" })
        } catch (e) {
            res.send({ result: "error" })
        }
    }))

    registerActionsAndCards(context)

    context.events.onEvent(
        context.mqtt,
        context,
        async (event) => registerActionsAndCards(context),
        "keys/update/MAIL_RESEND_TOKEN",
        "api"
    )
}