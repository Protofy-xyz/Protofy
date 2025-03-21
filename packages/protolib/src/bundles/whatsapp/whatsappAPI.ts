import { API } from "protobase";
import { AutoAPI, handler, getServiceToken} from 'protonode'
import { generateEvent } from "../events/eventsLibrary";
import { getLogger } from 'protobase';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { addAction } from "../actions/context/addAction";
import { addCard } from "../cards/context/addCard";


const logger = getLogger()

const qrImg = async (context)=>{ 
    try {
        const base64Img = await context.whatsapp.generateWhatsappQrCode(
            "phone",
            "message" + ` projectId: ${"a"}`
        );
        const base64RawData = base64Img.replace(/^data:image\/png;base64,/, "");
        return base64Img;

    } catch (error) {
        console.error('Error generando whatsapp QR:', error);
        return "Error generando la imagen";
    }
}

const registerActions = async (context)=>{
    addAction({
        group: 'whatsapp',
        name: 'message',
        url: `/api/core/v1/whatsapp/send/message`,
        tag: "send",
        description: "send a whatsapp message to a phone number",
        params: {phone: "E.164 format phone number started by + and country code. Example: +34666666666", message: "message value to send"},
        emitEvent: true
    })
}

const registerCards = async (context)=>{
    addCard({
        group: 'whatsapp',
        tag: "message",
        id: 'whatsapp_message_send',
        templateName: "whatsapp send message",
        name: "message_send",
        defaults: {
            name: "whatsapp_message_send",
            icon: "whatsapp",
            description: "send a whatsapp message to a phone number",
            rulesCode: `return execute_action("/api/core/v1/whatsapp/send/message", { phone: userParams.phone, message: userParams.message });`,
            params: {phone: "phone number", message: "message"},
            type: 'action'
        },
        emitEvent: true
    })

    addCard({
        group: 'whatsapp',
        tag: "onboarding",
        id: 'whatsapp_onboarding_qr',
        templateName: "whatsapp oboarding qr",
        name: "qr",
        defaults: {
            name: "whatsapp_onboarding_qr",
            icon: "whatsapp",
            html: `
//data contains: data.value, data.icon and data.color
return card({
    content: \`
        \${icon({ name: data.icon, color: data.color, size: '48' })}
        <img src="${await qrImg(context)}" alt="qr code" />
    \`
});
`,
            description: "show a qr code to send the onboarding message",
            rulesCode: `return null;`,
            type: 'value'
        },
        emitEvent: true
    })
}

registerActionsAndCards = async (context)=>{
    registerActions(context)
    registerCards(context)
}

export const WhatsappAPI = (app, context) => {
    const devicesPath = '../../data/devices/'
    const { topicSub, topicPub, mqtt } = context;
    registerActionsAndCards(context)
    
    app.get('/api/core/v1/whatsapp/send/message', handler(async (req, res, session) => {
        const { phone, message } = req.query
        // console.log("phone", phone)
        // console.log("message", message)
        if(!phone || !message){
            res.status(400).send({error: `Missing ${phone ? 'phone' : 'message'}`})
            return;
        }
        
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }

        try{
            await context.whatsapp.sendMessage(phone, message)
            res.send({result: "done"})
        }catch(e){
            logger.error("WhatsappAPI error", e)
            res.send({result: "error"})
        }
    }))
    
    app.get('/api/core/v1/whatsapp/qr/:phone/:message', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        const img = await context.whatsapp.generateWhatsappQrCode(req.params.phone, req.params.message)
        res.send({img})
    }))

   

    
    
}