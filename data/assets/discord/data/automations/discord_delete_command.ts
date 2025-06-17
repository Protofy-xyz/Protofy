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

    const GUILD_ID = await getKey({ key: "DISCORD_GUILD_ID", token: getServiceToken() }) ?? process.env.DISCORD_GUILD_ID;
    const CLIENT_ID = await getKey({ key: "DISCORD_CLIENT_ID", token: getServiceToken() }) ?? process.env.DISCORD_CLIENT_ID;
    const DISCORD_APP_TOKEN = await getKey({ key: "DISCORD_APP_TOKEN", token: getServiceToken() }) ?? process.env.DISCORD_APP_TOKEN;

    //PUT YOUR API HERE
    //context.deviceAction function allows to communicate with devices via mqtt
    //context.deviceSub allows to receive notifications from devices via mqtt
    //app is a normal expressjs object
    //context.mqtt is a mqttclient connection
    await context.automations.automation({
        name: "delete_command",
        responseMode: "wait",
        app: app,
        onRun: async (params, res) =>
            await context.discord.deleteCommand({
                commandName: "hello",
                guildId: GUILD_ID,
                clientId: CLIENT_ID,
                apiKey: DISCORD_APP_TOKEN
            }),
    });
})


