import { ProtoMemDB } from 'protobase';
import {handler} from 'protonode';

export const ProtoMemDBAPI = (app, context) => {
    app.get('/api/v1/protomemdb/:chunk', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        res.status(200).json(ProtoMemDB(req.params.chunk).getState())
    }))

    app.get('/api/v1/protomemdb/:chunk/:group', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        res.status(200).json(ProtoMemDB(req.params.chunk).getByGroup(req.params.group))
    }))

    app.get('/api/v1/protomemdb/:chunk/:group/:tag', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        res.status(200).json(ProtoMemDB(req.params.chunk).getByTag(req.params.group, req.params.tag))
    }))
    
    app.post('/api/v1/protomemdb/:chunk/:group/:tag/:name', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        console.log('Setting value', req.body.value, 'for', req.params.group, req.params.tag, req.params.name)
        ProtoMemDB(req.params.chunk).set(req.params.group, req.params.tag, req.params.name, req.body.value)
        res.status(200).json({ success: true })
    }))
}
