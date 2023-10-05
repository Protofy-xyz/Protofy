
import type {Request, RequestHandler, Response} from 'express';
import { z } from "zod";
import {verifyToken, createSession} from 'protolib/api';

type Handler = (
    fn: (req: Request, res: Response) => Promise<void> | void
) => RequestHandler;

export const handler: Handler = fn => async (req:any, res:any) => {
    //try to recover identify from token
    if(req.query.token || req.get('Auth-token')) {
        const token = req.query.token ? req.query.token : req.get('Auth-token')
        var decoded;
        try {
            decoded = verifyToken(token)
        } catch(e) {
            console.error('Error reading token: ', e)
            decoded = createSession()
        }
        console.log('decoded: ', decoded)
    }
    try {
        await fn(req, res);
    } catch (e:any) {
        if (e instanceof z.ZodError) {
            const err = (e as z.ZodError).flatten()
            res.status(500).send(err)
            return;
        }

        res.status(500).send({error: e.toString()})
    }
};