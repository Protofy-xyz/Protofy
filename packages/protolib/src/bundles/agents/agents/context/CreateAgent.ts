import { ProtoMqttAgent } from 'agents'
export default function (agentName) {
    return new ProtoMqttAgent(agentName)
}
