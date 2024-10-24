
import * as path from 'path';
import * as fs from 'fs';
import { handler, getApp} from 'protonode'
import { getDB } from 'app/bundles/storageProviders'
import { getLogger } from 'protobase';

const logger = getLogger()
const app = getApp()
logger.debug(`API Module loaded: ${__filename.split('.')[0]}`)

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
    const env = req.query.env ? path.basename(req.query.env as string) + '/' : ''
    
    const db = getDB(env+req.params.dbname, req)
    await db.put(req.params.key, JSON.stringify(req.body))
    res.send(req.body)
    return
}));

app.get('/adminapi/v1/databases/:dbname/:key/delete', requireAdmin(), handler(async (req, res) => {
    const env = req.query.env ? path.basename(req.query.env as string)+'/' : ''

    const db = getDB(env+req.params.dbname) 
    await db.del(req.params.key)
    res.send({"result": "deleted"})
    return
}));

app.post('/adminapi/v1/dbsearch/:dbname', requireAdmin(), handler(async (req, res) => {
    const env = req.query.env ? path.basename(req.query.env as string)+'/' : ''

    const db = getDB(env+req.params.dbname) 
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

export default 'databases'