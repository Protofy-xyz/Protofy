/*

This is an Automatic LCRUD API with custom storage layer.
getDB provides iterator, get and put. 
The storage layer used by generateApi/AutoAPI to interact with the storage

app is an express object, you can use app.get/app.post to create new endpoints
you can define newendpoints like:

app.get('/api/v1/testapi', (req, res, next) => {
    //you code goes here
    //reply with res.send(...)
})

the session argument is a session object, with the following shape:
{
    user: { admin: boolean, id: string, type: string },
    token: string,
    loggedIn: boolean
}

use the chat if in doubt
*/

import { AutoActions, AutoAPI, getAuth, getServiceToken } from "protonode";
import { API, Protofy, getLogger } from "protobase";
import APIContext from "app/bundles/context";
import { Application } from "express";
import fs from "fs";
import fsPath from "path";
import { {{modelName}} } from '../objects/{{object}}'

const root = fsPath.join(process.cwd(), '..', '..')
const logger = getLogger();

Protofy("type", "AutoAPI");
Protofy("object", "{{object}}");
const {name, prefix} = {{modelName}}.getApiOptions()

export default Protofy("code", async (app: Application, context: typeof APIContext) => {

    const jsonPath = fsPath.join(root, 'data', '{{object}}.json')
    
    const getElements = () => {
        if (!fs.existsSync(jsonPath)) {
            fs.writeFileSync(jsonPath, '[]')
        }
        return JSON.parse(fs.readFileSync(jsonPath).toString())
    }

    const {{codeName}}Actions = AutoActions({
        modelName: name,
        modelType: {{modelName}},
        prefix: prefix,
        object: '{{object}}'
    })

    const {{codeName}}API = AutoAPI({
        modelName: name,
        modelType: {{modelName}},
        initialData: {},
        prefix: prefix,
        getDB: (path, req, session) => {
            const db = {
                async *iterator() {
                    let elements = getElements()
                    for (const element of elements) {
                        yield [element.id, JSON.stringify(element)];
                    }
                },

                async put(key, value) {
                    let elements = getElements()
                    value = JSON.parse(value)
                    elements.push(value)
                    fs.writeFileSync(jsonPath, JSON.stringify(elements, null, 4))
                },

                async get(key) {
                    let elements = getElements()
                    return JSON.stringify(elements.find(element => element.id == key));
                },
            };

            return db;
        },
    });

    {{codeName}}Actions(app, context)
    {{codeName}}API(app, context)   
})