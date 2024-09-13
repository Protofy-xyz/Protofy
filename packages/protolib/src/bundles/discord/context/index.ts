import { getServiceToken } from '../../apis/context';
import { getKey } from '../../keys/context';
import { Client, GatewayIntentBits } from 'discord.js'

const getToken = async (apiKey?): Promise<string> => {
    if(apiKey) return apiKey
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
    console.log(`ProtoBot listo! Iniciado como ${client.user?.tag}`)
});

type connectProps = {
    onMessage?: (message: any) => void
    onConnect?: (client) => void
    onDisconnect?: (client) => void
    onError?: (err) => void
    apiKey?: string
}

const send = async ({channel, message, onSend}:{channel: any, message: string, onSend?: Function}) => {
    channel.send(message)
    if(onSend) onSend()
}

export const discord = {
    connect : async ({onMessage, onConnect, onDisconnect, onError, apiKey}:connectProps) => {
        const key = await getToken(apiKey)
        try {
            await client.login(key)
            client.on('disconnect', () => {
                if(onDisconnect) onDisconnect(client)
            })

            if(onConnect) onConnect(client)
            client.on('messageCreate', (message) => {
                if(onMessage) onMessage(message)
            })
    
        } catch (err) {
            if(onError) onError(err)
            console.error("Error al iniciar el bot:", err)
        }
    },
    send,
    response: async ({message, response, onSend}:{message: any, response: string, onSend?: Function}) => {
        return send({channel: message.channel, message: response, onSend})
    }
}


export default discord