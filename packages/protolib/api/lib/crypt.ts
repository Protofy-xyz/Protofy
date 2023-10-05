import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const hash = async (password: string) => bcrypt.hash(password, 10)
export const checkPassword = async (password: string, hash: string) => bcrypt.compare(password, hash)

export const genToken = (data:any) => {
    console.log('************** signing: ', data, 'with: ', process.env.TOKEN_SECRET)
    return jwt.sign(data, process.env.TOKEN_SECRET ?? '', { expiresIn: '3600000s' });
}

export const verifyToken = (token: string) => { 
    return jwt.verify(token, process.env.TOKEN_SECRET ?? '');
}