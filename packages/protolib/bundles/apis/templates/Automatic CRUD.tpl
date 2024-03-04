/*
app is an express object, you can use app.get/app.post to create new endpoints
you can define newendpoints like:

app.get('/api/v1/testapi', handler(async (req, res, session, next) => {
    //you code goes here
    //reply with res.send(...)
}))

the session argument is a session object, with the following shape:
{
    user: { admin: boolean, id: string, type: string },
    token: string,
    loggedIn: boolean
}

use the chat if in doubt
*/

import {Objects} from "app/bundles/objects";
import {AutoAPI} from 'protolib/api'
import {Protofy} from 'protolib/base'
import { Application } from 'express';
import { getLogger } from "protolib/base"

const logger = getLogger()

Protofy("type", "AutoAPI")
Protofy("object", "{{object}}")
const {name, prefix} = Objects.{{object}}.getApiOptions()

const {{name}}API = AutoAPI({
    modelName: name,
    modelType: Objects.{{object}},
    initialDataDir: __dirname,
    prefix: prefix
})

export default Protofy("code",(app:Application, context) => {
    {{name}}API(app, context) 
    //you can add more apis here, like:
    /*
    app.get('/api/v1/test/{{name}}', handler(async (req, res, session, next) => {
        //you code goes here
        //reply with res.send(...)
    }))
    */      
})