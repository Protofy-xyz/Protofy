import { Agent } from "./Agent";

export class AgentProtocol {
    agent: Agent;
    listeners: Function[];
    constructor(agent: Agent) {
        this.agent = agent;
        this.listeners = [];
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

    static create(agent: Agent) {
        return new AgentProtocol(agent);
    }
}