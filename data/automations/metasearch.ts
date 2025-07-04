import { AutoActions, AutoAPI, getAuth, getServiceToken } from 'protonode'
import APIContext from "app/bundles/context";
import { API, Protofy, getLogger } from "protobase";
import { Application } from 'express';
import fs from 'fs'
import path from "path";
import { MetasearchModel } from '../objects/metasearch'

const root = path.join(process.cwd(), '..', '..')
const logger = getLogger()

Protofy("type", "AutoAPI")
Protofy("object", "metasearch")
const {name, prefix} = MetasearchModel.getApiOptions()

const metasearchAPI = AutoAPI({
    modelName: name,
    modelType: MetasearchModel,
    initialData: {},
    prefix: prefix
})

const metasearchActions = AutoActions({
    modelName: name,
    modelType: MetasearchModel,
    prefix: prefix,
    object: 'metasearch'
})

export default Protofy("code", async (app:Application, context: typeof APIContext) => {
    metasearchAPI(app, context)
    metasearchActions(app, context)
    //you can add more apis here, like:
    /*
    app.get('/api/v1/test/metasearch', (req, res) => {
        //you code goes here
        //reply with res.send(...)
    })
    */      
})