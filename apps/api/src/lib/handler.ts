
import type {Request, RequestHandler, Response} from 'express';
import { z } from "zod";

type Handler = (
    fn: (req: Request, res: Response) => Promise<void> | void
) => RequestHandler;

export const handler: Handler = fn => async (req:any, res:any) => {
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