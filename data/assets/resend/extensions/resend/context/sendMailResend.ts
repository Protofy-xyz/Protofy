import { Resend } from 'resend';
import { getLogger } from 'protobase';

import { getServiceToken } from '@extensions/apis/coreContext';
import { getKey } from "@extensions/keys/coreContext";



const logger = getLogger()

export const sendMailWithResend = async (from, to, subject, html) => {
    // 'html' can be content or an html string

    var RESEND_TOKEN : string;

    try {
        RESEND_TOKEN = await getKey({
            key: "MAIL_RESEND_TOKEN",
            token: getServiceToken()
        });
    
    } catch (err) {
        logger.info(err, "There was an error getting RESEND_TOKEN key.")
    }

    if (!RESEND_TOKEN) {
        logger.warn("MAIL_RESEND_TOKEN not found in keys. Trying to find it in .env file. This will be deprecated soon.")
        RESEND_TOKEN = process.env.MAIL_RESEND_TOKEN;
    }

    if (!RESEND_TOKEN) {
        logger.error("Resend Api key is not provided at keys 'MAIL_RESEND_TOKEN'")
        return
    }
    const resend = new Resend(RESEND_TOKEN);
    const requestPayload = { from, to, subject, html }
    const response = await resend.emails.send(requestPayload as any);
    logger.info(response, "Email sent using 'Resend' to: " + requestPayload.to)
    return requestPayload
}

/* 
source: https://resend.com/
example:
{
    from: 'onboarding@resend.dev',
    to: 'gerard@protofy.xyz',
    subject: 'Hello World',
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>' or 'Hello world!'
} 
*/