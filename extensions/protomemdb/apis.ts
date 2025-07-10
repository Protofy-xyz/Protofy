import { ProtoMemDB } from 'protobase';
import {getServiceToken, handler} from 'protonode';
import { addAction } from '@extensions/actions/coreContext/addAction';
import { addCard } from '@extensions/cards/coreContext/addCard';
import { generateEvent } from 'protobase';

export default (app, context, inCore?) => {
    const part = inCore ? '/core' : ''
    app.get('/api'+part+'/v1/protomemdb/:chunk', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        res.status(200).json(ProtoMemDB(req.params.chunk).getState())
    }))

    app.get('/api'+part+'/v1/protomemdb/:chunk/:group', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        res.status(200).json(ProtoMemDB(req.params.chunk).getByGroup(req.params.group))
    }))

    app.get('/api'+part+'/v1/protomemdb/:chunk/:group/:tag', handler(async (req, res, session) => {
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        res.status(200).json(ProtoMemDB(req.params.chunk).getByTag(req.params.group, req.params.tag))
    }))
    
    app.post('/api'+part+'/v1/protomemdb/:chunk/:group/:tag/:name', handler(async (req, res, session) => {
        const prevValue = ProtoMemDB(req.params.chunk).get(req.params.group, req.params.tag, req.params.name)
        if(JSON.stringify(prevValue) === JSON.stringify(req.body.value)) {
            res.status(200).json({ changed: false })
            return
        }
        if(!session || !session.user.admin) {
            res.status(401).send({error: "Unauthorized"})
            return
        }
        ProtoMemDB(req.params.chunk).set(req.params.group, req.params.tag, req.params.name, req.body.value)
        res.status(200).json({ changed: true })
    }))

    if(inCore) {
        app.get('/api'+part+'/v1/actions/protomemdb/write', handler(async (req, res, session) => {
            const chunk = req.query.chunk || 'states'
            const group = req.query.group || 'boards'
            const tag = req.query.board
            const name = req.query.name
            const value = req.query.value

            if(!tag) {
                console.error("Missing tag")
                res.status(400).send({error: "Missing tag"})
                return
            }
            if(!name) {
                console.error("Missing name")
                res.status(400).send({error: "Missing name"})
                return
            }
            const prevValue = ProtoMemDB(chunk).get(group, tag, name)
            if(JSON.stringify(prevValue) === JSON.stringify(value)) {
                res.status(200).json({ changed: false })
                return
            }
            ProtoMemDB(chunk).set(group, tag, name, value)
            generateEvent({
                path: `${chunk}/${group}/${tag}/${name}/update`, 
                from: "states",
                user: 'system',
                payload:{value: value},
                ephemeral: true
            }, getServiceToken())
            res.status(200).json({ changed: true })
        }))
    }
}
