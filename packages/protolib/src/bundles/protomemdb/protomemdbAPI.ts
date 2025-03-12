import { ProtoMemDB } from 'protobase';
import {handler} from 'protonode';

export const ProtoMemDBAPI = (app, context) => {
    app.get('/api/v1/protomemdb', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        res.status(200).json({ tags:ProtoMemDB.getState() })
    }))

    app.get('/api/v1/protomemdb/:group', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        res.status(200).json(ProtoMemDB.getByGroup(req.params.group))
    }))

    app.get('/api/v1/protomemdb/:group/:tag', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        res.status(200).json(ProtoMemDB.getByTag(req.params.group, req.params.tag))
    }))
    
    app.post('/api/v1/protomemdb/:group/:tag/:name', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        ProtoMemDB.set(req.params.group, req.params.tag, req.params.name, req.body.value)
        res.status(200).json({ success: true })
    }))
}
