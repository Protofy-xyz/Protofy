import { ProtoMemDB } from 'protobase';
import {handler} from 'protonode';

export const ProtoMemDBAPI = (app, context) => {
    app.get('/api/v1/protomemdb', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        res.status(200).json({ tags:ProtoMemDB.getTags() })
    }))

    app.get('/api/v1/protomemdb/:tag', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        res.status(200).json(ProtoMemDB.getByTag(req.params.tag))
    }))
    
    app.post('/api/v1/protomemdb/:tag/:name', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        ProtoMemDB.set(req.params.tag, req.params.name, req.body.value)
        res.status(200).json({ success: true })
    }))
}
