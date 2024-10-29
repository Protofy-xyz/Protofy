import { ProtoAgent } from 'agents'

export default function (options: {
    agentName: string,
    connectionType: string,
    subsystems: object[],
    host: string,
    hostPort: number,
    onConnect: () => void
}) {
    const {
        agentName,
        connectionType,
        subsystems,
        host,
        hostPort,
        onConnect,
    } = options

    switch (connectionType) {
        case "mqtt":
            const agent = ProtoAgent.mqtt(agentName).configure(subsystems)
            agent.on("connect", onConnect)
            agent.connect(host, hostPort)
        default:
            return ProtoAgent.mqtt(agentName)
    }
}
