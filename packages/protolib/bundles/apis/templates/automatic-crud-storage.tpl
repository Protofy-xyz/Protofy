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

import { Objects } from "app/bundles/objects";
import { AutoAPI } from "protolib/api";
import { Protofy, API } from "protolib/base";
import { Application } from "express";
import { getLogger } from "protolib/base";
import { getAuth } from "protolib/api";
import fs from "fs";
import fsPath from "path";

const root = fsPath.join(process.cwd(), '..', '..')
const logger = getLogger();

Protofy("type", "AutoAPI");
Protofy("object", "{{object}}");
const { name, prefix } = Objects.{{object}}.getApiOptions();

export default Protofy("code", async (app: Application, context) => {

    const jsonPath = fsPath.join(root, 'data', '{{object}}.json')
    
    const getElements = () => {
        if (!fs.existsSync(jsonPath)) {
            fs.writeFileSync(jsonPath, '[]')
        }
        return JSON.parse(fs.readFileSync(jsonPath).toString())
    }

const {{name}}API = AutoAPI({
        modelName: name,
        modelType: Objects.{{object}},
        initialDataDir: __dirname,
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

    {{name}}API(app, context)   
})