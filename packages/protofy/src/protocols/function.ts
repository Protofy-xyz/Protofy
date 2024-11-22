import { Agent } from "../Agent";
import { AgentProtocol } from "../AgentProtocol";

export class FunctionProtocol extends AgentProtocol {
    constructor(agent: Agent) {
        super(agent);
    }

    send(params) {
        const agent = this.agent
        //check if the interface is a function
        if(agent.getProtocol().type !== 'function') {
            throw new Error('Error: Invalid protocol type, expected function')
        }

        if(!agent.getProtocol().config || !agent.getProtocol().config.fn) {
            throw new Error('Error: Invalid protocol config, expected fn')
        }

        //check if the function is a function
        if(typeof agent.getProtocol().config.fn !== 'function') {
            throw new Error('Error: Invalid function, expected function')
        }

        //call the function
        return {
            status: 'ok',
            result: agent.getProtocol().config.fn(...(Array.isArray(params) ? params : [params]))
        }
    }

    static create(agent: Agent) {
        return new FunctionProtocol(agent);
    }
}