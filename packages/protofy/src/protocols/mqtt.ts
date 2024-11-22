import { Agent } from "../Agent";
import { AgentProtocol } from "../AgentProtocol";
export class MQTTProtocol extends AgentProtocol {
    mqttClient: any;
    constructor(agent: Agent, mqttClient: any) {
        super(agent);
        this.mqttClient = mqttClient;
    }

    async send(params, options?) {
        const agent = this.agent
        const protocol = agent.getProtocol();
        if (protocol.type !== 'mqtt') {
            throw new Error('Error: Invalid protocol type, expected http');
        }
    
        const {
            topic,
        } = protocol.config;

        this.mqttClient.publish(topic, JSON.stringify(params));
    }

    static create(agent: Agent, mqttClient: any) {
        return new MQTTProtocol(agent, mqttClient);
    }
}