import { API } from "protobase";
import { AutoAPI, handler, getServiceToken} from 'protonode'
import { generateEvent } from "../events/eventsLibrary";
import { getLogger } from 'protobase';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { addAction } from "../actions/context/addAction";
import { addCard } from "../cards/context/addCard";
import {getKey} from "../keys/context";


const ONLY_LAST_MESSAGE = true
const MESSAGE_AND_PHONE_TOGETHER = false

const logger = getLogger()

const qrImg = async (context)=>{
    
    try {
        const base64Img = await context.whatsapp.generateWhatsappQrCode(
            process.env.WHATSAPP_PHONE,
            "Deseo inscribirme al board" + ` projectId: ${process.env.PROJECT_ID}`
        );
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
    if(!ONLY_LAST_MESSAGE){
        addCard({
        group: 'whatsapp',
        tag: "received",
        id: 'whatsapp_received_messages',
        templateName: "whatsapp received messages",
        name: "messages",
        defaults: {
            name: "whatsapp_received_messages",
            icon: "whatsapp",
            color: "#25d366",
            description: "received whatsapp messages",
            rulesCode: `return states.whatsapp.received.messages.map(msg => msg.from + ' -> ' + msg.content).join('<br>');`,
            type: 'value'
        },
        emitEvent: true
        })
    }
    if(MESSAGE_AND_PHONE_TOGETHER){
        addCard({
            group: 'whatsapp',
            tag: "received",
            id: 'whatsapp_received_message',
            templateName: "whatsapp last received message",
            name: "message",
            defaults: {
                name: "whatsapp_last_received_message",
                icon: "whatsapp",
                color: "#25d366",
                description: "whatsapp last received message",
                html: "\n//data contains: data.value, data.icon and data.color\nreturn card({\n    content: `\n        ${icon({ name: data.icon, color: data.color, size: '48' })}    \n        ${cardValue({ value: data.value.from+\" -> \"+data.value.content})}\n    `\n});\n",
                rulesCode: `return states?.whatsapp?.received?.message`,
                type: 'value'
            },
            emitEvent: true
        })
    }else{
        addCard({
            group: 'whatsapp',
            tag: "received",
            id: 'whatsapp_received_message',
            templateName: "whatsapp last received message",
            name: "message",
            defaults: {
                name: "whatsapp_last_received_message",
                icon: "whatsapp",
                color: "#25d366",
                description: "whatsapp last received message",
                rulesCode: `return states?.whatsapp?.received?.message`,
                type: 'value'
            },
            emitEvent: true
        })
        addCard({
            group: 'whatsapp',
            tag: "received",
            id: 'whatsapp_received_message_from',
            templateName: "whatsapp last received message from",
            name: "message_from",
            defaults: {
                name: "whatsapp_last_received_message_from",
                icon: "whatsapp",
                color: "#25d366",
                description: "whatsapp last received message from",
                rulesCode: `return states?.whatsapp?.received?.message_from`,
                type: 'value'
            },
            emitEvent: true
        })
    }


    
    //TODO: refactor name as recceived is
    addCard({
        group: 'whatsapp',
        tag: "message",
        id: 'whatsapp_message_send',
        templateName: "whatsapp send message",
        name: "message_send",
        defaults: {
            name: "whatsapp_message_send",
            icon: "whatsapp",
            color: "#25d366",
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
            color: "#25d366",
            html: process.env.WHATSAPP_PHONE && process.env.PROJECT_ID? `
//data contains: data.value, data.icon and data.color
return card({
    content: \`
        \${icon({ name: data.icon, color: data.color, size: '48' })}
        <img src="${await qrImg(context)}" alt="qr code" />
    \`
});
`:`
//data contains: data.value, data.icon and data.color
return card({
    content: \`
        \${icon({ name: data.icon, color: data.color, size: '48' })}
        Put the whatsapp phone number in the environment variable: WHATSAPP_PHONE & PROJECT_ID
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

const registerActionsAndCards = async (context)=>{
    registerActions(context)
    registerCards(context)
}

export const WhatsappAPI = (app, context) => {
    const devicesPath = '../../data/devices/'
    const { topicSub, topicPub, mqtt } = context;
    
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

    
   
    const cleanPhoneNumber = (phoneNumber) => {
        return phoneNumber.replace("whatsapp:","")
    }
    const formatMessage = (message) => {
        return `${message.from.replace("whatsapp:","")} -> ${message.content}`
    }

    context.state.set({ group: 'whatsapp', tag: "received", name: "message", value: "", emitEvent: true });
    context.state.set({ group: 'whatsapp', tag: "received", name: "message_from", value: "", emitEvent: true });
    
    context.whatsapp.subscribeToMessages(process.env.PROJECT_ID,'username', 'password', async (topic, message)=>{
        // console.log("TOPIC API WHATS: ", topic)
        // console.log("MESSAGE API WHATS: ", message)
        // console.log("MESSAGE API WHATS: ", typeof message)
        try{
            const msg = JSON.parse(message)
            let payload = {from: cleanPhoneNumber(msg.From), content: msg.Body}
            if(MESSAGE_AND_PHONE_TOGETHER){
                context.state.set({ group: 'whatsapp', tag: "received", name: "message", value: payload, emitEvent: true });
            }else{
                context.state.set({ group: 'whatsapp', tag: "received", name: "message", value: payload.content, emitEvent: true });
                context.state.set({ group: 'whatsapp', tag: "received", name: "message_from", value: payload.from, emitEvent: true });
            }
            if(ONLY_LAST_MESSAGE) return
            const prevValue = await context.state.get({ group: 'whatsapp', tag: "received", name: "messages", defaultValue: [] });
            // console.log("prevValue::::::::::::::: ", prevValue)
            let payloadArray = [payload]
            if(prevValue){
                //si el prevalue tiene una length igual a 10, entonces se elimina el primer elemento
                if(prevValue.length === 10){
                    prevValue.shift()
                }
                payloadArray = [...prevValue, ...payloadArray]
            } 
            // console.log("PAYLOAD::::::::::::::: ", payload)
            context.state.set({ group: 'whatsapp', tag: "received", name: "messages", value: payloadArray, emitEvent: true });
            
        }catch(e)
        {
            console.error("Error parsing whatsapp message", e)
        }
    })

    registerActionsAndCards(context)

    
}