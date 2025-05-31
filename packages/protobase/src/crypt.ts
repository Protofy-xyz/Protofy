import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const hash = async (password: string) => bcrypt.hash(password, 10)
export const checkPassword = async (password: string, hash: string) => bcrypt.compare(password, hash)

export const genToken = (data:any,options:any={ expiresIn: '3600000s' }) => {
    if (!process.env.TOKEN_SECRET) return
    return jwt.sign(data, process.env.TOKEN_SECRET, options);
}

export const verifyToken = (token: string) => { 
    return jwt.verify(token, process.env.TOKEN_SECRET ?? '');
}