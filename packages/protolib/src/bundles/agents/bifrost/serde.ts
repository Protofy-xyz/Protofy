/*
    bifrost is the protofy protocol for 
    agents connection and comunication.

    bifrost actions
    - register: a new agent (agents/<agent_name>/register)

    bifrost defaults
    - actions endpoint: agents/<agent_name>/subsystem/<subsystem_name>/action/<action_name>
    - monitors endpoint: agents/<agent_name>/subsystem/<subsystem_name>/monitor/<monitor_name>
*/

import { getDB } from '@my/config/dist/storageProviders';
import { AgentsModel } from '../agents/agentsSchemas';
import { MonitorType, SubsystemsSchema, SubsystemType } from '../subsystems/subsystemSchemas';
import { getLogger } from 'protobase';
import { generateEvent } from "../../events/eventsLibrary";
import { getServiceToken } from 'protonode';
import { heartbeatTimeout, defMonitorEndpoint } from './bifrostConfigs'

const logger = getLogger()
export const packageSerde = async (path: string, payload: string, subscriber: (path, handler) => void) => {
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

const registerMonitors = ({
    agentName,
    subsystem,
    monitor,
    subscriber,
    onMonitorMessage
}: {
    agentName: string,
    subsystem: SubsystemType,
    monitor: MonitorType,
    subscriber: (path, handler) => void,
    onMonitorMessage: (topic, message) => void
}) => {
    // fallback to 'agents/agentName/subsystem/subsystemsName/monitor/monitorName' if monitor endpoint is null
    const endpoint = monitor.endpoint ?? defMonitorEndpoint(agentName, subsystem.name, monitor.name)

    subscriber(endpoint, async (message, topic) => {
        try {
            const parsedMessage = JSON.parse(message)
            onMonitorMessage(topic, parsedMessage)
        } catch (err) {
            console.error("Error, cannot parse agent monitor message")
        }
    })
}

const register = async ({ path, agentName, endpoint, payload, subscriber }:
    {
        path: string,
        agentName: string,
        endpoint: string,
        payload: any,
        subscriber: (path, handler) => void
    }
) => {
    const db = getDB('agents')
    try {
        const validation = SubsystemsSchema.safeParse(payload['subsystems'])
        if (validation.success) {
            // register agent
            const agentInfo = AgentsModel.load(JSON.parse(await db.get(agentName)))
            agentInfo.setSubsystems(payload['subsystems'])
            await generateEvent(
                {
                    ephemeral: false,
                    path: path,
                    from: "agent",
                    user: agentName,
                    payload: {
                        agentName,
                        endpoint
                    }
                },
                getServiceToken()
            );

            // register agent monitors listeners
            payload['subsystems'].forEach(subsystem => {
                subsystem['monitors'].forEach(monitor => {
                    registerMonitors({
                        agentName,
                        subsystem,
                        monitor,
                        subscriber,
                        onMonitorMessage: async (monitorEndpoint, monitorMessage) => {
                            await generateEvent(
                                {
                                    ephemeral: false,
                                    path: monitorEndpoint,
                                    from: "agents",
                                    user: agentName,
                                    payload: {
                                        message: monitorMessage,
                                        agentName,
                                        monitorEndpoint
                                    }
                                },
                                getServiceToken()
                            );
                        }
                    })
                })
            })

            // update agent status
            status({ agentName })
        } else {
            throw new Error("Bad agent registration message format")
        }
    } catch (e) {
        console.error('cannot register agent: ', e)
    }
}

const status = async ({ agentName }) => {
    const last_view = Date.now()
    const online = true

    const db = getDB('agents')
    const agentInfo = AgentsModel.load(JSON.parse(await db.get(agentName)))
    await agentInfo.updateStatus({ online, last_view })

    setTimeout(() => {
        agentInfo.updateStatus({ online: false, last_view })
    }, heartbeatTimeout)
}