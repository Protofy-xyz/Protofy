/*
    bifrost is the protofy mqtt based protocol
    for agents connection and comunication. 
*/

import { getDB } from '@my/config/dist/storageProviders';
import { AgentsModel } from '../agents/agentsSchemas';
import { MonitorType, SubsystemsSchema } from '../subsystems/subsystemSchemas';
import { getLogger } from 'protobase';
import { generateEvent } from "../../events/eventsLibrary";
import { getServiceToken } from 'protonode';

const logger = getLogger()

export const bifrost = async (context: any) => {
    const { topicSub, mqtts } = context

    const processMessage = async (env: string, message: string, topic: string) => {
        const [agent, agentName, ...path] = topic.split("/");
        const endpoint = path.join("/")

        let parsedMessage = {};
        try {
            parsedMessage = JSON.parse(message);
            if (endpoint == 'debug') {
                logger.debug({ from: agent, agentName, endpoint }, JSON.stringify({ topic, message }))
            } else {
                messageHandlers(env, topic, endpoint, agentName, parsedMessage)
            }
        } catch (err) { }
    }

    const messageHandlers = async (env: string, topic: string, endpoint: string, agentName: string, payload: object) => {
        console.log('agents message handler payload: ', JSON.stringify(payload, null, 2))
        if (endpoint === "register") {
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
                            environment: env,
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
                            registerMonitors('mqtt', env, agentName, monitor)
                        })
                    })
                } else {
                    throw new Error("Bad agent registration message format")
                }
            } catch (e) {
                console.error('cannot register agent: ', e)
            }
        }
    }

    const registerMonitors = (type = 'mqtt', env: string, agentName: string, monitor: MonitorType) => {
        if (type == 'mqtt') {
            const { topicSub, mqtts } = context
            // fallback to 'agents/agentName/monitor/monitorName' if monitor endpoint is null
            const endpoint = monitor.endpoint ?? `agents/${agentName}/monitor/${monitor.name}`
            if (env === 'dev') {
                topicSub(mqtts['dev'], endpoint, async (message, topic) => {
                    try {
                        const parsedMessage = JSON.parse(message)
                        await generateEvent(
                            {
                                ephemeral: false,
                                environment: 'dev',
                                path: endpoint,
                                from: "agents",
                                user: agentName,
                                payload: {
                                    message: parsedMessage,
                                    agentName,
                                    endpoint
                                }
                            },
                            getServiceToken()
                        );
                    } catch (err) {
                        console.error("Error, cannot parse agent monitor message")
                    }
                })
            } else if (env === 'prod') {
                topicSub(mqtts['prod'], endpoint, async (message, topic) => {
                    try {
                        const parsedMessage = JSON.parse(message)
                        await generateEvent(
                            {
                                ephemeral: false,
                                environment: 'prod',
                                path: endpoint,
                                from: "agents",
                                user: agentName,
                                payload: {
                                    message: parsedMessage,
                                    agentName,
                                    endpoint
                                }
                            },
                            getServiceToken()
                        );
                    } catch (err) {
                        console.error("Error, cannot parse agent monitor message")
                    }
                })
            }
        }
    }

    topicSub(mqtts['dev'], 'agents/#', (message, topic) => processMessage('dev', message, topic))
    topicSub(mqtts['prod'], 'agents/#', (message, topic) => processMessage('prod', message, topic))
}
