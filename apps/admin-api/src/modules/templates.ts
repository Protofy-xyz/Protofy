import {app} from '../lib/app';
import { handler } from '../lib/handler';
import { response } from '../lib/response';
import * as path from 'path';
import * as fs from 'fs';
import { connectDB, getDB } from '../lib/db';
import {templates} from 'common'

app.post('/adminapi/v1/templates/:tplname', handler(async (req, res) => {
    const tplname = req.params.tplname;
    const params = req.body

    if(!templates[tplname]) {
        throw "No such template: "+tplname
    }

    await templates[tplname]({connectDB},params)

    res.send({"result":"created"})
    return
}));
