import {app} from '../lib/app';
import { handler } from '../lib/handler';
import { response } from '../lib/response';
import * as path from 'path';
import * as fs from 'fs';
import { connectDB, getDB } from '../lib/db';

app.get('/adminapi/v1/databases', handler(async (req, res) => {
    res.send([{name:'auth'},{name:'db'}])
}));

app.get('/adminapi/v1/databases/:dbname', handler(async (req, res) => {
    const dbname = '../../' + path.join('data','databases', req.params.dbname)
    await connectDB(dbname)
    const db = getDB(dbname)
    const total = []
    for await (const [key, value] of db.iterator()) {
        if(key != 'initialized') total.push({key, value: JSON.parse(value)})
    }
    res.send(total)
    return
}));

app.post('/adminapi/v1/databases/:dbname/:key', handler(async (req, res) => {
    const dbname = '../../' + path.join('data','databases', req.params.dbname)
    await connectDB(dbname)
    const db = getDB(dbname)
    await db.put(req.params.key, JSON.stringify(req.body))
    res.send(req.body)
    return
}));

app.get('/adminapi/v1/databases/:dbname/:key/delete', handler(async (req, res) => {
    const dbname = '../../' + path.join('data','databases', req.params.dbname)
    await connectDB(dbname)
    const db = getDB(dbname)
    await db.del(req.params.key)
    res.send({"result": "deleted"})
    return
}));

app.post('/adminapi/v1/dbsearch/:dbname', handler(async (req, res) => {
    const dbname = '../../' + path.join('data','databases', req.params.dbname)
    await connectDB(dbname)
    const db = getDB(dbname)
    const total = []
    for await (const [key, value] of db.iterator()) {
        if(key != 'initialized') {
            if(key.includes(req.body.search) || value.includes(req.body.search))
                total.push({key, value: JSON.parse(value)})
        }
    }
    res.send(total)
    return
}));