import { ProtoMemDB } from 'protobase';

export const ProtoMemDBAPI = (app, context) => {
    app.get('/api/v1/protomemdb', (req, res) => {
        
        res.status(200).json({ tags:ProtoMemDB.getTags() })
    })
}
