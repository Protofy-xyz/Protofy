import initialData from "./initialData";
import { connectDB, handler, getDB } from 'protolib/api/lib'
import { NoteModel } from "./models";

export default (app) => {
    const entityName = 'notes'
    const dbPath = '../../data/databases/'+entityName
    connectDB(dbPath, initialData) //preconnect database

    app.get('/api/v1/'+entityName, handler(async (req, res) => {
        const db = getDB(dbPath)
        const total = []
        for await (const [key, value] of db.iterator()) {
            if(key != 'initialized') total.push({key, value: JSON.parse(value)})
        }
        res.send(total)
        return
    }));

    app.post('/api/v1/'+entityName+'/:key', handler(async (req, res) => {
        const db = getDB(dbPath)
        await db.put(req.params.key, JSON.stringify(req.body))
        res.send(req.body)
        return
    }));

    app.get('/api/v1/'+entityName+'/:key/delete', handler(async (req, res) => {
        const db = getDB(dbPath)
        await db.del(req.params.key)
        res.send({"result": "deleted"})
        return
    }));
}
