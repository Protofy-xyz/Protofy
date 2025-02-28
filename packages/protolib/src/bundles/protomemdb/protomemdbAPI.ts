import { ProtoMemDB } from 'protobase';

export const ProtoMemDBAPI = (app, context) => {
    app.get('/api/v1/protomemdb', (req, res) => {
        res.status(200).json({ tags:ProtoMemDB.getTags() })
    })
    app.get('/api/v1/protomemdb/:tag', (req, res) => {
        res.status(200).json(ProtoMemDB.getByTag(req.params.tag))
    })
}
