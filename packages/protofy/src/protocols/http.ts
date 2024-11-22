import axios, { AxiosRequestConfig } from 'axios';
import { Agent } from "../Agent";
import { AgentProtocol } from '../AgentProtocol';

export class HTTPProtocol extends AgentProtocol {
    constructor(agent: Agent) {
        super(agent);
    }

    async send(params, options?) {
        const agent = this.agent
        const protocol = agent.getProtocol();
        if (protocol.type !== 'http') {
            throw new Error('Error: Invalid protocol type, expected http');
        }
    
        if (!protocol.config || !protocol.config.url) {
            throw new Error('Error: Missing URL in protocol config');
        }
    
        const {
            url,
            method = 'GET',
            encoder = 'query',
            serializer = 'json',
        } = protocol.config;
    
        let config: AxiosRequestConfig = {
            method,
            url,
            headers: {},
            ...options
        };
    
        let serializedParams: any = params;
        switch (serializer) {
            case 'json':
                break;
            case 'form':
                serializedParams = new URLSearchParams(params);
                break;
            default:
                throw new Error(`Error: Unsupported serializer type ${serializer}`);
        }
    
        switch (encoder) {
            case 'body':
                config.data = serializedParams;
                break;
            case 'query':
                config.params = serializedParams;
                break;
            default:
                throw new Error(`Error: Unsupported encoder type ${encoder}`);
        }
    
        if (encoder === 'body' && serializer === 'json') {
            config.headers['Content-Type'] = 'application/json';
        } else if (encoder === 'body' && serializer === 'form') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
    
        try {
            const response = await axios(config);
            let result = response.data;
            return {
                status: 'ok',
                code: response.status,
                result
            };
        } catch (error: any) {
            return {
                status: 'error',
                error: error.message,
                details: error.response?.data || null,
            };
        }
    }

    static create(agent: Agent) {
        return new HTTPProtocol(agent);
    }
}