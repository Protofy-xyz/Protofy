import { Objects } from "app/bundles/objects";
import { AutoActions, AutoAPI, getAuth, getServiceToken } from 'protonode'
import { APIContext } from "protolib/bundles/apiContext"
import { API, Protofy, getLogger } from "protobase";
import { Application } from 'express';
import fs from 'fs'
import path from "path";
{{#if useDirectImport}}
import { {{modelName}} } from '../objects/{{object}}'
{{/if}}

const root = path.join(process.cwd(), '..', '..')
const logger = getLogger()

Protofy("type", "AutoAPI")
Protofy("object", "{{object}}")
const {name, prefix} = {{#if useDirectImport}}{{modelName}}{{else}}Objects.{{object}}{{/if}}.getApiOptions()

const {{codeName}}API = AutoAPI({
    modelName: name,
    modelType: {{#if useDirectImport}}{{modelName}}{{else}}Objects.{{object}}{{/if}},
    initialData: {},
    prefix: prefix
})

const {{codeName}}Actions = AutoActions({
    modelName: name,
    modelType: {{#if useDirectImport}}{{modelName}}{{else}}Objects.{{object}}{{/if}},
    prefix: prefix
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