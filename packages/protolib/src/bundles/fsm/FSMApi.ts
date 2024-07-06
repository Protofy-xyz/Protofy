import { getSourceFile, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI, getRoot, removeFileWithImports, addFeature, removeFeature, hasFeature } from '../../api'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { FSMModel } from "./FSMSchema";
import FSMs from "app/bundles/custom/fsm";

const FSMDir = (root) => fspath.join(root, "/packages/app/bundles/custom/fsm/")
const getFSM = (fsmPath, req) => {
    return {
        name: fsmPath.replace(/\.[^/.]+$/, ""), //remove extension
    }
}

const getDB = (path, req, session) => {
    const db = {
        async *iterator() {
            const files = (await fs.readdir(FSMDir(getRoot(req)))).filter(f => f != 'index.ts' && !fsSync.lstatSync(fspath.join(FSMDir(getRoot(req)), f)).isDirectory() && f.endsWith('.ts'))
            const fsms = await Promise.all(files.map(async f => getFSM(f, req)));

            for (const fsm of fsms) {
                if (fsm) yield [fsm.name, JSON.stringify(fsm)];
            }
        },

        async del(key, value) {
            value = JSON.parse(value)

        },

        async put(key, value) {
            value = JSON.parse(value)

        },

        async get(key) {
            return JSON.stringify({ name: key })
        }
    };

    return db;
}
export const FSMApi = (app, context) => {
    const autoAPI = AutoAPI({
        modelName: 'fsm',
        modelType: FSMModel,
        prefix: '/adminapi/v1/',
        getDB: getDB,
        connectDB: () => new Promise(resolve => resolve(null)),
        requiresAdmin: ['*'],
        useEventEnvironment: false,
        useDatabaseEnvironment: false
    })
    autoAPI(app, context)
    app.get('/adminapi/v1/fsm/:name/send',(req,res)=>{
        const msg = JSON.parse(req.query.msg)
        const fsmActor = FSMs[req.params.name]
        if(!fsmActor){
            res.status(404).send('FSM not found')
            return
        } 
        fsmActor.send(msg)
        res.send('OK')
    })

    app.get('/adminapi/v1/fsm/:name/context/:key',(req,res)=>{
        // const msg = JSON.parse(req.params.msg)
        const fsmActor = FSMs[req.params.name]
        if(!fsmActor){
            res.status(404).send('FSM not found')
            return
        } 
        const currentState = fsmActor.getSnapshot();
        const value = currentState.context[req.params.key]
        if(typeof value === 'undefined'){
            res.status(404).send('Key not found in FSM')
            return
        }
        res.send({[req.params.key]:value})
    })

    app.get('/adminapi/v1/fsm/:name/context',(req,res)=>{
        // const msg = JSON.parse(req.params.msg)
        const fsmActor = FSMs[req.params.name]
        if(!fsmActor){
            res.status(404).send('FSM not found')
            return
        } 
        const currentState = fsmActor.getSnapshot();
        res.send(currentState.context)
    })
}

