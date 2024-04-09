import {getLogger } from 'protolib/base';

const logger = getLogger()

export const automation = (app, cb, name)=>{
    const url = "/api/v1/automations/"+name;

    app.get(url,(req,res)=>{
        logger.info({name, params: req.query}, "Automation executed: "+name)
        cb(req.query)
        res.send('"OK"');
    })
}
