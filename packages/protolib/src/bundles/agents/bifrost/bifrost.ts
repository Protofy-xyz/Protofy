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
import { MonitorType, SubsystemsSchema } from '../subsystems/subsystemSchemas';
import { getLogger } from 'protobase';
import { generateEvent } from "../../events/eventsLibrary";
import { getServiceToken } from 'protonode';
import { heartbeatTimeout } from './bifrostUtils';

const logger = getLogger()

export const register = async ({ topic, agentName, endpoint, payload, registerMonitors }:
    {
        topic: string,
        agentName: string,
        endpoint: string,
        payload: any,
        registerMonitors: (agentName: string, subsystem, monitor: MonitorType, onMonitorMessage: (monitorEndoint, message) => void) => void
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
                    path: topic,
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
                    registerMonitors(agentName, subsystem, monitor, async (monitorEndpoint, monitorMessage) => {
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


export const status = async ({ agentName }) => {
    const last_view = Date.now()
    const online = true

    const db = getDB('agents')
    const agentInfo = AgentsModel.load(JSON.parse(await db.get(agentName)))
    await agentInfo.updateStatus({ online, last_view })

    setTimeout(() => {
        agentInfo.updateStatus({ online: false, last_view })
    }, heartbeatTimeout)
}