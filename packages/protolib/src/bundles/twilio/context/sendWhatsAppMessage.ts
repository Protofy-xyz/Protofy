import twilio from "twilio";
import { getServiceToken } from '@extensions/apis/context';
import {getKey} from "../../keys/context";


export const sendWhatsAppMessage  = async ({message, from,to,TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN}) => {
    if (!message) {
        throw new Error("Message is required");
    }
    if (!to) {
        throw new Error("To is required");
    }
    if(!from){
        throw new Error("From is required")
    }
    
    const accountSid = TWILIO_ACCOUNT_SID || await getKey({key:"TWILIO_ACCOUNT_SID",token: getServiceToken()}) || process.env.TWILIO_ACCOUNT_SID;
    const authToken = TWILIO_AUTH_TOKEN || await getKey({key:"TWILIO_AUTH_TOKEN",token: getServiceToken()}) || process.env.TWILIO_AUTH_TOKEN;
    // console.log("accountSid: ", accountSid)
    // console.log("authToken: ", authToken)
    const client = twilio(accountSid, authToken);
    // console.log("client: ", client)
    const messageObj = await client.messages.create({
        body: message,
        from: `whatsapp:${from}`,
        to: `whatsapp:${to}`
    });
}