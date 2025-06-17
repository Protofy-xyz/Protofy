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

    // RUN THIS AUTOMATION TO CREATE THE COMMAND
    await context.automations.automation({
        name: "create_command_hello",
        responseMode: "wait",
        app: app,
        onRun: async (params, res) => await context.discord.createCommand({
            guildId: GUILD_ID,
            clientId: CLIENT_ID,
            apiKey: DISCORD_APP_TOKEN,
            overwrite: false,
            command: async (commandBuilder) => {
                return commandBuilder
                    .setName('hello')
                    .setDescription('Say hello from your bot')
                    .addStringOption(option =>
                        option.setName('hello_message')
                            .setDescription('The message to send')
                            .setRequired(true)
                    )
            }
        })
    });

    context.discord.commandActionsHandler({
        guildId: GUILD_ID,
        clientId: CLIENT_ID,
        apiKey: DISCORD_APP_TOKEN,
        actions: {
            hello: async (interaction: any) => {
                console.log('User has executed /hello command')
                const helloMsg = interaction.options.getString('hello_message');

                await interaction.deferReply();

                // Here you can add any logic you want to execute when the command is called

                try {
                    await interaction.editReply(`Hello from bot!\n${helloMsg}`);
                } catch (error) {
                    await interaction.editReply('Error saying hello');
                }

            },
        }
    })
})


