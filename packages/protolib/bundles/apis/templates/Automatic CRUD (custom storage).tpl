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
import { AutoAPI } from 'protolib/api'
import { Protofy } from 'protolib/base'
import { Application } from 'express';
import { getLogger } from "protolib/base"
import { getAuth } from "protolib/api";
import fs from 'fs'

const logger = getLogger()

Protofy("type", "AutoAPI")
Protofy("object", "{{object}}")
const {name, prefix} = Objects.{{object}}.getApiOptions()

const {{name}}API = AutoAPI({
    modelName: name,
    modelType: Objects.{{object}},
    initialDataDir: __dirname,
    prefix: prefix,
    getDB: (path, req, session) => {
        const db = {
            async *iterator() {
                let elements = [] 
                //TODO: recover your array of elements
                //elements = await API.call(...) or fs.readdir(...) or whaterver method you use to recover your objects
                for (const element of elements) {
                    yield [element.id, JSON.stringify(element)]; //yield each element, to generate an iterable
                }
            },

            async put(key, value) {
                //key is the key to store
                //value is a JSON encoded string to store in the record
                //value = JSON.parse(value) //decode if needed
                //TODO: store your value
            },

            async get(key) {
                let obj = {}
                //TODO: recover your object. Key is the string of the object key to be retrieved.
                //obj = await API.call(...) or fs.read(...) or whaterver method you use to read your objects
                return JSON.stringify(obj)
            }
        };

        return db;
    }
})

export default Protofy("code",(app:Application, context) => {
    {{name}}API(app, context)   
})