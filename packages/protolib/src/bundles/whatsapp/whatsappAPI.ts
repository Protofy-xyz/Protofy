import { API } from "protobase";
import { AutoAPI, handler, getServiceToken} from 'protonode'
import { generateEvent } from "../events/eventsLibrary";
import { getLogger } from 'protobase';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { addAction } from "../actions/context/addAction";

const logger = getLogger()


export const WhatsappAPI = (app, context) => {
    const devicesPath = '../../data/devices/'
    const { topicSub, topicPub, mqtt } = context;
    
    // registerActions()
    addAction({
        group: 'whatsapp',
        name: 'message',
        url: `/api/core/v1/whatsapp/send/message`,
        tag: "send",
        description: "send a whatsapp message to a phone number",
        params: {phone: "E.164 format phone number started by + and country code. Example: +34666666666", message: "message value to send"},
        emitEvent: true
    })

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