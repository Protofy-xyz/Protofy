
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

const requireAdmin = () => handler(async (req, res, session, next) => {
    if(!session || !session.user.admin) {
        res.status(401).send({error: "Unauthorized"})
        return
    }
    next()
})

app.post('/adminapi/v1/databases/:dbname/:key', requireAdmin(), handler(async (req, res) => {
    const dbname = '../../' + path.join('data','databases', req.params.dbname)
    await connectDB(dbname, getInitialData(dbname))
    const db = getDB(dbname)
    await db.put(req.params.key, JSON.stringify(req.body))
    res.send(req.body)
    return
}));

app.get('/adminapi/v1/databases/:dbname/:key/delete', requireAdmin(), handler(async (req, res) => {
    const dbname = '../../' + path.join('data','databases', req.params.dbname)
    await connectDB(dbname, getInitialData(dbname))
    const db = getDB(dbname)
    await db.del(req.params.key)
    res.send({"result": "deleted"})
    return
}));

app.post('/adminapi/v1/dbsearch/:dbname', requireAdmin(), handler(async (req, res) => {
    const dbname = '../../' + path.join('data','databases', req.params.dbname)
    await connectDB(dbname, getInitialData(dbname))
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