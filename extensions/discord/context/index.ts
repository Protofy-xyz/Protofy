import { getServiceToken } from '@extensions/apis/coreContext';
import { getKey } from '@extensions/keys/coreContext';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js'

type connectProps = {
    onMessage?: (message: any, client?: any) => void
    onConnect?: (client) => void
    onDisconnect?: (client) => void
    onError?: (err) => void
    apiKey?: string
}

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

const registerDiscordCommand = async (command, guildId, clientId, apiKey, filter = (cmd: any) => true ) => {
    const key = await getToken(apiKey);
    const rest = new REST({ version: '10' }).setToken(key);
    try {
        // Fetch existing commands
        const existingCommands: any = (await rest.get(
            Routes.applicationGuildCommands(clientId, guildId)
        ));

        // Convert existing commands to JSON and add the new command
        const updatedCommands = [
            ...existingCommands
                ?.filter(filter)
                ?.map(cmd => ({
                    name: cmd.name,
                    description: cmd.description,
                    options: cmd.options
                }))
        ];

        if(command) {
            updatedCommands.push(command.toJSON())
        }

        console.log('Started refreshing application (/) commands.');

        // Update with the combined list of commands
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: updatedCommands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error updating commands:', error);
    }
}

// Listeners 
client.once('ready', () => {
    console.log(`ProtoBot connected! ${client.user?.tag}`)
});

const send = async ({ channel, message, onSend }: { channel: any, message: string, onSend?: Function }) => {
    if (channel && typeof channel === 'string') { // Checks that provided channel is channelId instead of channel object
        try {
            channel = await client.channels.fetch(channel); // Fetch channel object given channelId ('channel')
        } catch (err) {
            console.error("Error fetching channel: ", err);
        }
    }
    channel.send(message)
    if (onSend) onSend()
}

export const discord = {
    client: client,
    connect: async ({ onMessage, onConnect, onDisconnect, onError, apiKey }: connectProps) => {
        const key = await getToken(apiKey)
        if (!key) return console.log('Discord api not available. The token “DISCORD_APP_TOKEN” has not been provided.')
        try {
            await client.login(key)
            client.on('disconnect', () => {
                if (onDisconnect) onDisconnect(client)
            })

            if (onConnect) onConnect(client)
            client.on('messageCreate', (message) => {
                if (onMessage) onMessage(message, client)
            })

        } catch (err) {
            if (onError) onError(err)
            console.error("Bot initialization error", err)
        }
    },
    send: send,
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
                await onMessagesRead(messages, client);
            }
        } catch (err) {
            console.error("Error fetching messages from the channel:", err);
            throw err;
        }
    },
    createCommand: async ({ guildId, clientId, command, apiKey, overwrite = false }: { guildId: string, clientId: string, command: any, apiKey?: string, overwrite?: boolean }) => {
        /* @params
            overwrite: allow to overwrite specific command given its name
        */
        const commandBuilder = new SlashCommandBuilder()
        const newCommand = await command(commandBuilder);
        const filter = (cmd) => (!overwrite || cmd.name != newCommand.toJSON()?.name)
        await registerDiscordCommand(newCommand, guildId, clientId, apiKey, filter);
    },
    deleteCommand: async ({ guildId, clientId, commandName, apiKey }: { guildId: string, clientId: string, commandName: string, apiKey?: string }) => {
        // WIP: Not working
        const filter = (cmd) => (cmd.name != commandName)
        await registerDiscordCommand(null, guildId, clientId, apiKey, filter);
    },
    commandActionsHandler: async ({ actions, guildId, clientId, apiKey }: { actions: any, guildId: string, clientId: string, apiKey?: string }) => { // actions = { upload: (interaction)=> ... , send: (interaction) =>...}
        client.once('ready', async () => {
            const key = await getToken(apiKey);
            const rest = new REST({ version: '10' }).setToken(key);

            const getExistingCommandNames = async () => { // Fetch existing commands
                try {
                    const existingCommands: any = await rest.get(
                        Routes.applicationGuildCommands(clientId, guildId)
                    );
                    return existingCommands?.map(cmd => cmd.name);
                } catch (e) {
                    console.log('Error getting existing command names: ', e)
                    return []
                }
            }

            const existingDiscordCommandNames = await getExistingCommandNames();
            const userInputActions = Object.keys(actions); // Actions that user has added 
            const missingDiscordCommands = userInputActions?.filter(act => !existingDiscordCommandNames?.includes(act));
            if (missingDiscordCommands && missingDiscordCommands?.length) { // Extra validation and feedback
                console.log('Caution: There are missing actions to configure that are defined by the user but not handled at discord. Action names: ', missingDiscordCommands);
            }
            // Handle interactions listener
            client.on('interactionCreate', async interaction => {
                const getActionByCommand = (actionName: string) => actions[actionName]
                console.log('interaction created successfully')
                if (!interaction.isChatInputCommand()) return;
                    const { commandName } = interaction;
                    const actionFunction = getActionByCommand(commandName)
                    if (actionFunction) {
                        try {
                            await actionFunction(interaction);
                        } catch (error) {
                            console.error('Error in slash command action:', error);
                        }
                    }
            });
        });
    },
    interactionsHandler: async ({ onInteract = (interaction) => { }, onError = (e) => { } }: { onInteract?: any, onError?: any }) => {
        client.once('ready', async () => {
            client.on('interactionCreate', async interaction => {
                    try {
                        await onInteract(interaction);
                    } catch (error) {
                        console.error('Error in slash command action:', error);
                        onError(error)
                    }
            });
        });
    }
}


export default discord