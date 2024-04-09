import { getLogger } from 'protolib/base';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const logger = getLogger()

export const sendMailWithMailgun = async (from, to, subject, html) => {
    const MAILGUN_TOKEN = process.env.MAIL_MAILGUN_TOKEN
    if (!MAILGUN_TOKEN) {
        logger.error("Resend Api key is not provided at env 'MAIL_MAILGUN_TOKEN'")
        return
    }
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({ username: 'api', key: MAILGUN_TOKEN });

    mg.messages.create('protofy.xyz', {
        from: from,
        to: [ to ],
        subject,
        text: "Testing some Mailgun awesomeness!",
        html
    })
        .then(msg => {
            logger.info(msg, "Email sent using 'Mailgun' to: " + to)
        }) // logs response data
        .catch(err => {
            logger.error(err, "Email error using 'Mailgun'")
        }); // logs any error
}