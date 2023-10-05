import {initialData} from "./notesInitialData";
import { connectDB, handler, getDB } from 'protolib/api/lib'
import { NoteModel } from "./notesModels";
import { NoteType } from "./notesSchemas";

export const NotesAPI = (app) => {
    const entityName = 'notes'
    const dbPath = '../../data/databases/'+entityName
    connectDB(dbPath, initialData) //preconnect database

    //list
    app.get('/api/v1/'+entityName, handler(async (req, res) => {
        const db = getDB(dbPath)
        const total:NoteType[] = []
        for await (const [key, value] of db.iterator()) {
            if(key != 'initialized' && !NoteModel.unserialize(value).isDeleted()) total.push(NoteModel.unserialize(value).list())
        }
        res.send(total)
    }));

    //create
    app.post('/api/v1/'+entityName, handler(async (req, res) => {
        const db = getDB(dbPath)
        const note = NoteModel.load(req.body).create()
        await db.put(note.getId(), note.serialize())
        res.send(note.read())
    }));

    //read
    app.get('/api/v1/'+entityName+'/:key', handler(async (req, res) => {
        const db = getDB(dbPath)
        try {
            const content = NoteModel.unserialize(await db.get(req.params.key)).read()
            res.send(content)
        } catch(e) {
            console.error("Error reading from database: ", e)
            res.status(404).send({result: "not found"})
        }
    }));

    //update
    app.post('/api/v1/'+entityName+'/:key', handler(async (req, res) => {
        const db = getDB(dbPath)
        const note = NoteModel.unserialize(await db.get(req.params.key)).update(NoteModel.load(req.body).validate())              
        await db.put(note.getId(), note.serialize())
        res.send(note.read())
    }));

    //delete
    app.get('/api/v1/'+entityName+'/:key/delete', handler(async (req, res) => {
        const db = getDB(dbPath)
        const note = NoteModel.unserialize(await db.get(req.params.key)).delete()
        await db.put(note.getId(), note.serialize())
        res.send({"result": "deleted"})
    }));
}
