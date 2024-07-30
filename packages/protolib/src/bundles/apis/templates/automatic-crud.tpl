import { Objects } from "app/bundles/objects";
import { AutoAPI, getAuth } from 'protonode'
import { APIContext } from "protolib/bundles/apiContext"
import { API, Protofy, getLogger } from "protobase";
import { Application } from 'express';
import fs from 'fs'
import path from "path";

const root = path.join(process.cwd(), '..', '..')
const logger = getLogger()

Protofy("type", "AutoAPI")
Protofy("object", "{{object}}")
const {name, prefix} = Objects.{{object}}.getApiOptions()

const {{codeName}}API = AutoAPI({
    modelName: name,
    modelType: Objects.{{object}},
    initialData: {},
    prefix: prefix,
    useDatabaseEnvironment: true
})

export default Protofy("code", async (app:Application, context: typeof APIContext) => {
    {{codeName}}API(app, context) 
    //you can add more apis here, like:
    /*
    app.get('/api/v1/test/{{codeName}}', (req, res) => {
        //you code goes here
        //reply with res.send(...)
    })
    */      
})