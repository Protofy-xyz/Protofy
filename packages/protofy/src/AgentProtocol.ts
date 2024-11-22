import { Agent } from "./Agent";

export class AgentProtocol {
    agent: Agent;
    listeners: Function[];
    options: any
    constructor(agent: Agent, options?: any) {
        this.agent = agent;
        this.listeners = [];
        this.options = options;
    }

    onMessage(cb: Function) {
        this.listeners.push(cb);
    }

    notify(data) {
        this.listeners.forEach(cb => cb(data, this.agent));
    }
    
    send(params, options?) {
        throw new Error('Not implemented');
    }

    static create(agent: Agent, options?: any) {
        return new AgentProtocol(agent, options);
    }
}