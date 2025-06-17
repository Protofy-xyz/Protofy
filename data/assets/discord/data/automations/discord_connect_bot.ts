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
import { Application } from 'express';
import fs from 'fs'
import path from "path";
import { getKey } from "@extensions/keys/coreContext";

const root = path.join(process.cwd(), '..', '..')
const logger = getLogger()

Protofy("type", "CustomAPI")

export default Protofy("code", async (app: Application, context) => {
    //PUT YOUR API HERE
    //context.deviceAction function allows to communicate with devices via mqtt
    //context.deviceSub allows to receive notifications from devices via mqtt
    //app is a normal expressjs object
    //context.mqtt is a mqttclient connection
    
    const DISCORD_APP_TOKEN = await getKey({ key: "DISCORD_APP_TOKEN", token: getServiceToken() }) ?? process.env.DISCORD_APP_TOKEN;
    
    await context.discord.connect({
        onMessage: async (message) => { },
        apiKey: DISCORD_APP_TOKEN,
        onConnect: async (client) =>
            await context.logs.log({
                message: "Discord bot successfully connected! ",
                level: "info",
            }),
        onDisconnect: async (client) =>
            await context.logs.log({
                message: "Discord bot successfully disconnected! ",
                level: "info",
            }),
    });
})


