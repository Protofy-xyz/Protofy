import mqtt, { MqttClient } from 'mqtt';
import { genActionEndpoint, pubMonitor, register } from './bifrost';

export class ProtoMqttAgent {
    name: string
    client: MqttClient
    subsystems: Array<any>;
    subsystemsHandlers: { [key: string]: { [key: string]: (payload: any) => void } };
    type: string;

    constructor(agentName) {
        this.name = agentName;
        this.client = null as any;
        this.subsystems = [];
        this.type = "mqtt";
        this.subsystemsHandlers = {};
    }

    configure(subsystems) {
        this.subsystems = subsystems;
        return this;
    }

    connect(mqttHost, mqttPort) {
        const url = `mqtt://${mqttHost}:${mqttPort}`;
        this.client = mqtt.connect(url);

        this.client.on('connect', () => {
            console.log(`Connected to MQTT broker at ${url}`);
            register(this.client.publish.bind(this.client), this.name, this.subsystems).then(() => {
                console.log(`Agent ${this.name} registered with subsystems.`);
            });

            // Consumer defined callback
            this.__consumerCallbacksChecker('on_connect');
        });

        this.client.on('error', (error) => {
            console.error('Connection error: ', error);
        });
    }

    pubMonitor(subsystemName, monitorName, value) {
        pubMonitor(this.client.publish.bind(this.client), this.name, subsystemName, monitorName, value).then(() => {
            console.log(`Published monitor value ${value} to subsystem ${subsystemName}`);
        });

        // Consumer defined callback
        this.__consumerCallbacksChecker('on_monitor_pub', value);
    }

    handle(subsystemName, actionName, handler) {
        const subsystem = this.subsystems.find(s => s.name === subsystemName);
        if (!subsystem) {
            throw new Error(`Subsystem '${subsystemName}' not found.`);
        }

        const action = subsystem.actions.find(a => a.name === actionName);
        if (!action) {
            throw new Error(`Action '${actionName}' not found in subsystem '${subsystemName}'.`);
        }

        if (!this.subsystemsHandlers[subsystemName]) {
            this.subsystemsHandlers[subsystemName] = {};
        }

        this.subsystemsHandlers[subsystemName][actionName] = handler;

        // Register action subscriber
        const topic = genActionEndpoint(this.name, subsystemName, actionName);
        this.client.subscribe(topic, (err) => {
            if (err) {
                console.error(`Failed to subscribe to topic: ${topic}`, err);
            } else {
                console.log(`Subscribed to topic: ${topic}`);
            }
        });

        // Register the message handler
        this.__onMessage();

        console.log(`Handler assigned for action '${actionName}' in subsystem '${subsystemName}'`);
    }

    __onMessage() {
        this.client.on('message', (topic, message) => {
            const payload = message.toString();
            const handlers = this.subsystemsHandlers;

            for (const [subsystemName, actions] of Object.entries(handlers)) {
                for (const [actionName, handler] of Object.entries(actions)) {
                    const expectedTopic = genActionEndpoint(this.name, subsystemName, actionName);
                    if (topic === expectedTopic) {
                        handler(payload);
                        return;
                    }
                }
            }

            console.log(`No handler found for topic: ${topic}`);
        });
    }

    __consumerCallbacksChecker(name, value = null) {
        if (typeof this[name] === 'function') {
            if (value !== null) {
                this[name](value);
            } else {
                this[name]();
            }
        }
    }
}