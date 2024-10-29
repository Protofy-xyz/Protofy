import { ProtoAgent } from 'agents'
export default function (agentName) {
    return ProtoAgent.mqtt(agentName)
}
