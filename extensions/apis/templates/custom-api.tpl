/*

app is an express object, you can use app.get/app.post to create new endpoints
you can define newendpoints like:

app.get('/api/v1/testapi', (req, res) => {
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

import { getAuth, getServiceToken } from "protonode";
import { API, Protofy, getLogger } from "protobase";
import APIContext from "app/bundles/context";
import { Application } from 'express';
import fs from 'fs'
import path from "path";

const root = path.join(process.cwd(), '..', '..')
const logger = getLogger()

Protofy("type", "CustomAPI")

export default Protofy("code", async (app: Application, context: typeof APIContext) => {
    //context allows to use extension functions without directly importing the extension.
    //app is a normal expressjs object
    //context.mqtt is a mqttclient connection
    //this a wrapper around express, you can directly execute this automation in
    // /api/v1/automations/{{codeNameLowerCase}}
    // use query parameters in the url to pass parameters to the automation
    context.automations.automation({
        name: '{{codeNameLowerCase}}',
        responseMode: 'wait',
        app: app
    })
    //app.get(...) is possible here to create normal express endpoints
})


