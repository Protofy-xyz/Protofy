import { handler } from 'protonode'
import { getLogger, getServiceToken } from 'protobase';
import fs from 'fs';
import path from 'path';
import { addAction } from "@extensions/actions/coreContext/addAction";
import { addCard } from "@extensions/cards/coreContext/addCard";

const logger = getLogger()

const registerActions = async (context) => {
    addAction({
        group: 'discord',
        name: 'message',
        url: `/api/v1/discord/send/message`,
        tag: "send",
        description: "send a discord message to a phone number",
        params: { channelId: "Id of the discord channel. Example: 1265288881511596073", message: "message value to send" },
        emitEvent: true,
        token: await getServiceToken()
    })
}

const registerCards = async (context) => {
    addCard({
        group: 'discord',
        tag: "received",
        id: 'discord_received_message',
        templateName: "discord last received message",
        name: "message",
        defaults: {
            name: "discord_last_received_message",
            icon: "discord",
            color: "#5865F2",
            description: "discord last received message",
            rulesCode: `return states?.discord?.received?.message`,
            type: 'value',
            html: `
            //data contains: data.value, data.icon and data.color
            return card({
                content: \`
                    \${icon({ name: data.icon, color: data.color, size: '48' })}    
                    \${cardValue({ value: "#" + data.value.channelName, style: "font-size: 16px; color: #A0A4A7; font-weight: 400;" })}
                    \${cardValue({ value: data.value.username, style: "font-size: 16px; color: #f7b500; margin-top: 0px;" })}
                    \${cardValue({ value: data.value.content, style: "font-size: 20px; font-weight: 400; margin-top: 10px" })}
                \`
            });
            `
        },
        emitEvent: true,
        token: await getServiceToken()
    })

    addCard({
        group: 'discord',
        tag: "received",
        id: 'discord_received_message_content',
        templateName: "discord last received message content",
        name: "message_content",
        defaults: {
            name: "discord_last_received_message_content",
            icon: "discord",
            color: "#5865F2",
            description: "discord last received message",
            rulesCode: `return states?.discord?.received?.message?.content`,
            type: 'value'
        },
        emitEvent: true,
        token: await getServiceToken()
    })

    addCard({
        group: 'discord',
        tag: "received",
        id: 'discord_received_message_from',
        templateName: "discord last received message from",
        name: "message_from",
        defaults: {
            name: "discord_last_received_message_from",
            icon: "discord",
            color: "#5865F2",
            description: "discord last received message from",
            rulesCode: `return states?.discord?.received?.message?.author?.username`,
            type: 'value'
        },
        emitEvent: true,
        token: await getServiceToken()
    })

    addCard({
        group: 'discord',
        tag: "received",
        id: 'discord_received_message_channel',
        templateName: "discord last received message channel",
        name: "message_channel",
        defaults: {
            name: "discord_last_received_message_channel",
            icon: "discord",
            color: "#5865F2",
            description: "discord last received message channel",
            rulesCode: `return states?.discord?.received?.message?.channelName`,
            type: 'value'
        },
        emitEvent: true,
        token: await getServiceToken()
    })

    addCard({
        group: 'discord',
        tag: "message",
        id: 'discord_message_send',
        templateName: "discord send message",
        name: "message_send",
        defaults: {
            name: "discord_message_send",
            icon: "discord",
            color: "#5865F2",
            description: "send a discord message to a channel",
            rulesCode: `return execute_action("/api/v1/discord/send/message", { channelId: userParams.channelId, message: userParams.message, channelName: userParams.channelName });`,
            params: { channelId: "channelId", message: "message", channelName: "channelName" },
            type: 'action'
        },
        emitEvent: true,
        token: await getServiceToken()
    })
}

const registerActionsAndCards = async (context) => {
    registerActions(context)
    registerCards(context)
}

const getChannelNameFromId = async (client, channelId) => {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
        return channel.name
    } else {
        try {
            const fetchedChannel = await client.channels.fetch(channelId);
            return fetchedChannel.name
        } catch (error) { }
    }
}

const getChannelIdFromName = async (client, channelName) => {
    const channel = client.channels.cache.find(channel => channel.name === channelName);
    if (channel) {
        return channel.id
    } else {
        try {
            const fetchedChannel = await client.channels.fetch(channelName);
            return fetchedChannel.id
        } catch (error) { }
    }
}

const connectDiscord = async (context) => {
    await context.discord.connect({
        onMessage: async (message, client) => {
            const channelName = await getChannelNameFromId(client, message.channelId)

            if (channelName) {
                message.channelName = channelName
            }
            message.username = message.author?.username ?? ''
            context.state.set({ group: 'discord', tag: "received", name: "message", value: message, emitEvent: false });
        },
        onConnect: async (client) =>
            await context.logs.log({
                from: "extensions",
                name: "discord",
                message: "Discord bot successfully connected! ",
                level: "info",
            }),
        onDisconnect: async (client) =>
            await context.logs.log({
                from: "extensions",
                name: "discord",
                message: "Discord bot successfully disconnected! ",
                level: "info",
            }),
    });
}

export default async (app, context) => {
    // timeout required to connect successfully
    setTimeout(async () => {
        connectDiscord(context)
    }, 3000)

    context.events.onEvent(
        context.mqtt,
        context,
        async (event) => connectDiscord(context),
        "keys/create/DISCORD_APP_TOKEN",
        "api"
    )
    // TODO: on upate doesn't delete the old token
    // context.events.onEvent(
    //     context.mqtt,
    //     context,
    //     async (event) => connectDiscord(context),
    //     "keys/update/DISCORD_APP_TOKEN",
    //     "api"
    // )

    app.get('/api/v1/discord/send/message', handler(async (req, res, session) => {
        const { channelId: channel_id, message, channelName } = req.query
        let channelId = channel_id

        const client = context.discord.client
        if (!client) {
            res.status(500).send({ error: "Discord client not connected" })
            return
        }

        if (channelName) {
            channelId = await getChannelIdFromName(client, channelName)
        }

        if (!channelId || !message) {
            res.status(400).send({ error: `Missing ${channelId ? 'channel' : 'message'}` })
            return;
        }

        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }


        try {
            await context.discord.send({
                channel: channelId, message: message
            })
            res.send({ result: "done" })
        } catch (e) {
            logger.error("Discord API error", e)
            res.send({ result: "error" })
        }
    }))

    registerActionsAndCards(context)
}