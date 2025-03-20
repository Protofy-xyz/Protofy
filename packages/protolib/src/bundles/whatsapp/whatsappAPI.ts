import { API } from "protobase";
import { DevicesModel } from ".";
import { AutoAPI, handler, getServiceToken, getDeviceToken } from 'protonode'
import { generateEvent } from "../../events/eventsLibrary";
import { getLogger } from 'protobase';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { addAction } from "../../actions/context/addAction";

const logger = getLogger()


export const WhatsappAPI = (app, context) => {
    const devicesPath = '../../data/devices/'
    const { topicSub, topicPub, mqtt } = context;
    
    // registerActions()
    addAction({
        group: 'Whatsapp',
        name: 'send-message'
        url: `/api/core/v1/whatsApp/`,
        tag: deviceInfo.data.name,
        description: action.description ?? "",
        ...!action.payload?.value ? {params: {value: "value to set"}}:{},
        emitEvent: true
    })

    app.get('/api/core/v1/whatsapp/send/message/:phone/:message', handler(async (req, res, session) => {
        const { phone, message } = req.params
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