import { Agent } from "../Agent";

//function runner
export default (agent: Agent, params) => {
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