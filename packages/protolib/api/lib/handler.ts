
import type {Request, RequestHandler, Response} from 'express';
import { z } from "zod";
import {createSession, SessionDataType} from './session';
import {verifyToken} from './crypt';

type Handler = (
    fn: (req: Request, res: Response, session: SessionDataType, next: any) => Promise<void> | void
) => RequestHandler;

export const handler: Handler = fn => async (req:any, res:any, next:any) => {
    //try to recover identify from token
    let decoded;
    let session;
    try {
        session = JSON.parse(req.cookies.session)
    } catch(e) {
        session = null
    }

    if(req.query.token || (session && session.token)) {
        const token = req.query.token ? req.query.token : session.token
        try {
            decoded = createSession(verifyToken(token))
        } catch(e) {
            console.error('Error reading token: ', e)
            decoded = createSession()
        }
    } else {
        createSession()
    }
    try {
        await fn(req, res, decoded, next);
    } catch (e:any) {
        if (e instanceof z.ZodError) {
            const err = (e as z.ZodError).flatten()
            res.status(500).send(err)
            return;
        }

        res.status(500).send({error: e.toString()})
    }
};