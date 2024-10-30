import { ProtoAgent } from 'agents'

export default function (options: {
    agentName: string,
    connectionType: string,
    subsystems: object[],
    host: string,
    hostPort: number,
    auth: boolean,
    username: string,
    password: string,
    onConnect: () => void
}) {
    const {
        agentName,
        connectionType,
        subsystems,
        host,
        hostPort,
        auth,
        username,
        password,
        onConnect,
    } = options

    switch (connectionType) {
        case "mqtt":
            const agent = ProtoAgent.mqtt(agentName).configure(subsystems)
            agent.on("connect", onConnect)
            if (auth) {
                agent.connect(host, hostPort, { username, password })
            } else {
                agent.connect(host, hostPort)
            }
        default:
            return ProtoAgent.mqtt(agentName)
    }
}
