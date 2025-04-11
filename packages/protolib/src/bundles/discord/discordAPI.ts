import { handler } from 'protonode'
import { getLogger } from 'protobase';
import fs from 'fs';
import path from 'path';
import { addAction } from "../actions/context/addAction";
import { addCard } from "../cards/context/addCard";

const logger = getLogger()

const registerActions = async (context) => {
    addAction({
        group: 'discord',
        name: 'message',
        url: `/api/core/v1/discord/send/message`,
        tag: "send",
        description: "send a discord message to a phone number",
        params: { channelId: "Id of the discord channel. Example: 1265288881511596073", message: "message value to send" },
        emitEvent: true
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
            rulesCode: `return states?.discord?.received?.message?.content`,
            type: 'value'
        },
        emitEvent: true
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
        emitEvent: true
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
        emitEvent: true
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
            rulesCode: `return execute_action("/api/core/v1/discord/send/message", { channelId: userParams.channelId, message: userParams.message, channelName: userParams.channelName });`,
            params: { channelId: "channelId", message: "message", channelName: "channelName" },
            type: 'action'
        },
        emitEvent: true
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
            context.state.set({ group: 'discord', tag: "received", name: "message", value: message, emitEvent: false });
        },
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
}

export const DiscordAPI = async (app, context) => {

    // timeout required to connect successfully
    setTimeout(async () => {
        connectDiscord(context)
    }, 3000)

    context.onEvent(
        context.mqtt,
        context,
        async (event) => connectDiscord(context),
        "keys/create/DISCORD_APP_TOKEN",
        "api"
    )
    // TODO: on upate doesn't delete the old token
    // context.onEvent(
    //     context.mqtt,
    //     context,
    //     async (event) => connectDiscord(context),
    //     "keys/update/DISCORD_APP_TOKEN",
    //     "api"
    // )

    app.get('/api/core/v1/discord/send/message', handler(async (req, res, session) => {
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
            logger.error("WhatsappAPI error", e)
            res.send({ result: "error" })
        }
    }))

    registerActionsAndCards(context)
}