import { sendMailWithResend } from 'protolib/api/lib/mail';

export const sendMail = async (from, to, subject, content)=>{
    return await sendMailWithResend(from, to, subject, content)
} 