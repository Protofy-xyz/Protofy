import { AutoActions, AutoAPI, getAuth, getServiceToken } from 'protonode'
import APIContext from "app/bundles/context";
import { API, Protofy, getLogger } from "protobase";
import { Application } from 'express';
import fs from 'fs'
import path from "path";
import { {{modelName}} } from '../objects/{{object}}'

const root = path.join(process.cwd(), '..', '..')
const logger = getLogger()

Protofy("type", "AutoAPI")
Protofy("object", "{{object}}")
const {name, prefix} = {{modelName}}.getApiOptions()

const {{codeName}}API = AutoAPI({
    modelName: name,
    modelType: {{modelName}},
    initialData: {},
    prefix: prefix
})

const {{codeName}}Actions = AutoActions({
    modelName: name,
    modelType: {{modelName}},
    prefix: prefix,
    pageSrc: '/workspace/objects/view?object={{object}}Model&mode=embed'
})

export default Protofy("code", async (app:Application, context: typeof APIContext) => {
    {{codeName}}API(app, context)
    {{codeName}}Actions(app, context)
    //you can add more apis here, like:
    /*
    app.get('/api/v1/test/{{codeName}}', (req, res) => {
        //you code goes here
        //reply with res.send(...)
    })
    */      
})