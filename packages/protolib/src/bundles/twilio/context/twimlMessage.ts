import{ twiml } from 'twilio';

export const twimlMessage = (message: string) =>{
    const { MessagingResponse } = twiml;
    const twimlResponse = new MessagingResponse();

    twimlResponse.message(message);
  
    return twimlResponse.toString();
}