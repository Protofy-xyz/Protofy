import { Resend } from 'resend';
import { getLogger } from 'protobase';

const logger = getLogger()

export const sendMailWithResend = async (from, to, subject, html) => {
    // 'html' can be content or an html string
    const RESEND_TOKEN = process.env.MAIL_RESEND_TOKEN
    if (!RESEND_TOKEN) {
        logger.error("Resend Api key is not provided at env 'MAIL_RESEND_TOKEN'")
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