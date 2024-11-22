import { Agent } from "../Agent";

//options is for auth params and similar protocol-specific options
export default async (agent: Agent, params: any, options = {}) => {
    const protocol = agent.getProtocol();
    if (protocol.type !== 'mqtt') {
        throw new Error('Error: Invalid protocol type, expected http');
    }

    if (!protocol.config || !protocol.config.url || !protocol.config.topic) {
        throw new Error('Error: Missing URL or topic in protocol config');
    }

    const {
        url,
        topic,
        encoder = 'body',
        serializer = 'json',
    } = protocol.config;

    
};