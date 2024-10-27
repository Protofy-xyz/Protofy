import { MonitorType, SubsystemType } from "../../subsystems/subsystemSchemas"
import { register } from "../bifrost"
import { defMonitorEndpoint } from "../bifrostUtils"

export const MqttTransporter = (context) => {
    const { topicSub, mqtt, logger } = context
    topicSub(mqtt, 'agents/#', (message, topic) => handle(topic, message))
    
    const handle = (topic, message) => {
        const [agent, agentName, ...path] = topic.split("/");
        const endpoint = path.join("/")

        let parsedMessage = {};
        try {
            parsedMessage = JSON.parse(message);
            if (endpoint == 'debug') {
                logger.debug({ from: agent, agentName, endpoint }, JSON.stringify({ topic, message }))
            } else {
                messageHandlers(topic, endpoint, agentName, parsedMessage)
            }
        } catch (err) { }
    }

    const messageHandlers = async (topic: string, endpoint: string, agentName: string, payload: object) => {
        console.log('agents message handler payload: ', JSON.stringify(payload, null, 2))
        if (endpoint === "register") {
            register({topic, agentName, endpoint, payload, registerMonitors: registerMonitors })
        }
    }

    const registerMonitors = (agentName: string, subsystem: SubsystemType, monitor: MonitorType, onMonitorMessage: (topic, message) => void) => {
        // fallback to 'agents/agentName/subsystem/subsystemsName/monitor/monitorName' if monitor endpoint is null
        const endpoint = monitor.endpoint ?? defMonitorEndpoint(agentName, subsystem.name, monitor.name)
        console.log("registering monitor", endpoint)

        topicSub(mqtt, endpoint, async (message, topic) => {
            try {
                const parsedMessage = JSON.parse(message)
                onMonitorMessage(topic, parsedMessage)
            } catch (err) {
                console.error("Error, cannot parse agent monitor message")
            }
        })
        
    }
}