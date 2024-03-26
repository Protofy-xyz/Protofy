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

import { Protofy } from 'protolib/base'
import { getAuth } from "protolib/api";
import { getLogger } from "protolib/base"
import { Application } from 'express';
import fs from 'fs'
import path from "path";

const root = path.join(process.cwd(), '..', '..')
const logger = getLogger()

Protofy("type", "IOTRouter")

export default Protofy("code",(app, context) => {
    ///PUT YOUR ROUTER LOGIC HERE
    //context.devicePub function allows to communicate with devices via mqtt
    //contextdeviceSub allows to receive notifications from devices via mqtt
    //app is a normal expressjs object
    //context.mqtt is a mqttclient connection
    
    // TODO refactor this example (message callback)
    //IoT device flow example:
    // context.deviceSub('testdevice', 'testbutton', (message) => {
    //     message == 'ON' ?
    //         context.devicePub('testdevice', 'switch', 'testrelay', 'OFF')
    //         : context.devicePub('testdevice', 'switch', 'testrelay', 'ON')
    // })

    logger.info("IOT Router {{name}} started")
    app.get("/api/v1/action", (req, res) => {
        context.devicePub("device name", "component name", "component action");
        res.send("Action Done");
    });
})
