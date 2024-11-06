/*
    bifrost is the protofy protocol for 
    agents connection and comunication.

    bifrost actions
    - register: a new agent (agents/<agent_name>/register)
    - status: report an agent status (agents/<agent_name>/status)

    bifrost defaults
    - actions endpoint: agents/<agent_name>/subsystem/<subsystem_name>/action/<action_name>
    - monitors endpoint: agents/<agent_name>/subsystem/<subsystem_name>/monitor/<monitor_name>
*/

import { getLogger } from 'protobase';
import { register, status } from './driver';

const logger = getLogger()
export const routePackage = async (path: string, payload: string, subscriber: (path, handler) => void) => {
    const [agent, agentName, ...segments] = path.split("/");
    const endpoint = segments.join("/")

    let parsedPayload = payload
    try {
        parsedPayload = JSON.parse(payload)
    } catch (err) { }

    if (endpoint == 'debug') {
        logger.debug({ from: agent, agentName, endpoint }, JSON.stringify({ path, parsedPayload }))
    }

    console.log('agents message handler payload: ', payload)
    if (endpoint === "register") {
        register({ path, agentName, endpoint, payload: parsedPayload, subscriber })
    } else if (endpoint === "status") {
        status({ agentName })
    }
}