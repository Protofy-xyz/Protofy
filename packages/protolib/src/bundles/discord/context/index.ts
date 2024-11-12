import { getServiceToken } from '../../apis/context';
import { getKey } from '../../keys/context';
import { Client, GatewayIntentBits } from 'discord.js'

const getToken = async (apiKey?): Promise<string> => {
    if (apiKey) return apiKey
    try {
        const token = await getKey({ key: "DISCORD_APP_TOKEN", token: getServiceToken() })
        return token
    } catch (err) {
        console.error("Error fetching key:", err)
        throw new Error("No se pudo obtener el token.")
    }
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`ProtoBot connected! ${client.user?.tag}`)
});

type connectProps = {
    onMessage?: (message: any) => void
    onConnect?: (client) => void
    onDisconnect?: (client) => void
    onError?: (err) => void
    apiKey?: string
}

export const discord = {
    connect: async ({ onMessage, onConnect, onDisconnect, onError, apiKey }: connectProps) => {
        const key = await getToken(apiKey)
        try {
            await client.login(key)
            client.on('disconnect', () => {
                if (onDisconnect) onDisconnect(client)
            })

            if (onConnect) onConnect(client)
            client.on('messageCreate', (message) => {
                if (onMessage) onMessage(message)
            })

        } catch (err) {
            if (onError) onError(err)
            console.error("Bot initialization error", err)
        }
    },
    send: async ({ channel, message, onSend }: { channel: any, message: string, onSend?: Function }) => {
        if (channel && typeof channel === 'string') { // Checks that provided channel is channelId instead of channel object
            try {
                channel = await client.channels.fetch(channel); // Fetch channel object given channelId ('channel')
            } catch (err) {
                console.error("Error fetching channel: ", err);
            }
        }
        channel.send(message)
        if (onSend) onSend()
    },
    response: async ({ message, response, onSend }: { message: any, response: string, onSend?: Function }) => {
        return send({ channel: message.channel, message: response, onSend })
    },
    readMessages: async ({ channelId, limit = 0, onMessagesRead }: { channelId: string, limit?: number, onMessagesRead: Function }) => {
        console.log("Reading messages from channel", channelId, "with limit:", limit);
        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel || !channel.isTextBased()) {
                throw new Error("Channel not found or is not a text-based channel.");
            }

            let messages = [];
            let lastMessageId;
            let fetchedMessages;
            let remainingMessages = limit; // Tracks how many messages are left to fetch

            do {
                // If limit is 0 (fetch all), request 100, otherwise fetch the minimum of 100 or the remaining messages
                const fetchLimit = limit === 0 ? 100 : Math.min(remainingMessages, 100);

                fetchedMessages = await channel.messages.fetch({ limit: fetchLimit, before: lastMessageId });
                messages.push(...fetchedMessages.values());
                lastMessageId = fetchedMessages.last()?.id;

                // Update remaining messages count, if we are limiting
                if (limit !== 0) {
                    remainingMessages -= fetchedMessages.size;
                }
            } while (fetchedMessages.size > 0 && (limit === 0 || remainingMessages > 0));

            // Call the onMessagesRead callback with the fetched messages
            if (onMessagesRead) {
                await onMessagesRead(messages);
            }
        } catch (err) {
            console.error("Error fetching messages from the channel:", err);
            throw err;
        }
    }
}


export default discord