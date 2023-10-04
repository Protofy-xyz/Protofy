
import * as path from 'path';
import * as fs from 'fs';
import {connectDB, getDB, handler, app} from 'protolib/api'
import { getInitialData } from 'app/initialData';

console.log(`API Module loaded: ${__filename.split('.')[0]}`);

export const getDatabases = async () => {
    return (await fs.promises.readdir('../../'+path.join('data', 'databases'))).map((name)=>{
        return {
            name: name
        }
    })
}

app.get('/adminapi/v1/databases', handler(async (req, res) => {
    res.send(await getDatabases())
}));

app.get('/adminapi/v1/databases/:dbname', handler(async (req, res) => {
    const dbname = '../../' + path.join('data','databases', req.params.dbname)
    await connectDB(dbname, getInitialData)
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
    await connectDB(dbname, getInitialData)
    const db = getDB(dbname)
    await db.put(req.params.key, JSON.stringify(req.body))
    res.send(req.body)
    return
}));

app.get('/adminapi/v1/databases/:dbname/:key/delete', handler(async (req, res) => {
    const dbname = '../../' + path.join('data','databases', req.params.dbname)
    await connectDB(dbname, getInitialData)
    const db = getDB(dbname)
    await db.del(req.params.key)
    res.send({"result": "deleted"})
    return
}));

app.post('/adminapi/v1/dbsearch/:dbname', handler(async (req, res) => {
    const dbname = '../../' + path.join('data','databases', req.params.dbname)
    await connectDB(dbname, getInitialData)
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