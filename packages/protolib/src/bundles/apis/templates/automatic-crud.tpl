import { Objects } from "app/bundles/objects";
import { AutoAPI } from 'protolib/api'
import { Protofy, API } from 'protolib/base'
import { Application } from 'express';
import { getLogger } from "protolib/base"
import { getAuth } from "protolib/api";
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

export default Protofy("code", async (app:Application, context) => {
    {{codeName}}API(app, context) 
    //you can add more apis here, like:
    /*
    app.get('/api/v1/test/{{codeName}}', (req, res) => {
        //you code goes here
        //reply with res.send(...)
    })
    */      
})