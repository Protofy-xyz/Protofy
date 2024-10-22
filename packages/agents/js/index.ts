import * as mqtt from 'mqtt';
import { genActionEndpoint, pubMonitor, register } from './bifrost';

export class ProtoMqttAgent {
    name: string
    client: mqtt.MqttClient
    listeners: any
    subsystems: Array<any>;
    subsystemsHandlers: { [key: string]: { [key: string]: (payload: any) => void } };
    type: string;

    constructor(agentName) {
        this.name = agentName;
        this.client = null as any;
        this.listeners = {} as any
        this.subsystems = [];
        this.type = "mqtt";
        this.subsystemsHandlers = {};
    }

    on(key: "connect" | "error", cb: Function) {
        this.listeners[key] = cb
    }

    configure(subsystems) {
        this.subsystems = subsystems;
        return this;
    }

    connect(mqttHost, mqttPort) {
        const url = `mqtt://${mqttHost}:${mqttPort}`;
        this.client = mqtt.connect(url)
        try {
            this.client.on('error', (error) => {
                this.__consumerCallbacksChecker("error")
            });

            this.client.on('connect', () => {
                register(this.client.publish.bind(this.client), this.name, this.subsystems)
                this.__consumerCallbacksChecker("connect")
            });

            return this
        } catch (err) {
            console.error("Cannot connect agent", err)
        }

        return null
    }

    // pubMonitor(subsystemName, monitorName, value) {
    //     pubMonitor(this.client.publish.bind(this.client), this.name, subsystemName, monitorName, value).then(() => {
    //         console.log(`Published monitor value ${value} to subsystem ${subsystemName}`);
    //     });

    //     // Consumer defined callback
    //     this.__consumerCallbacksChecker('on_monitor_pub', value);
    // }

    // handle(subsystemName, actionName, handler) {
    //     const subsystem = this.subsystems.find(s => s.name === subsystemName);
    //     if (!subsystem) {
    //         throw new Error(`Subsystem '${subsystemName}' not found.`);
    //     }

    //     const action = subsystem.actions.find(a => a.name === actionName);
    //     if (!action) {
    //         throw new Error(`Action '${actionName}' not found in subsystem '${subsystemName}'.`);
    //     }

    //     if (!this.subsystemsHandlers[subsystemName]) {
    //         this.subsystemsHandlers[subsystemName] = {};
    //     }

    //     this.subsystemsHandlers[subsystemName][actionName] = handler;

    //     // Register action subscriber
    //     const topic = genActionEndpoint(this.name, subsystemName, actionName);
    //     this.client.subscribe(topic, (err) => {
    //         if (err) {
    //             console.error(`Failed to subscribe to topic: ${topic}`, err);
    //         } else {
    //             console.log(`Subscribed to topic: ${topic}`);
    //         }
    //     });

    //     // Register the message handler
    //     this.__onMessage();

    //     console.log(`Handler assigned for action '${actionName}' in subsystem '${subsystemName}'`);
    // }

    // __onMessage() {
    //     this.client.on('message', (topic, message) => {
    //         const payload = message.toString();
    //         const handlers = this.subsystemsHandlers;

    //         for (const [subsystemName, actions] of Object.entries(handlers)) {
    //             for (const [actionName, handler] of Object.entries(actions)) {
    //                 const expectedTopic = genActionEndpoint(this.name, subsystemName, actionName);
    //                 if (topic === expectedTopic) {
    //                     handler(payload);
    //                     return;
    //                 }
    //             }
    //         }

    //         console.log(`No handler found for topic: ${topic}`);
    //     });
    // }

    __consumerCallbacksChecker(name, value = null) {
        if (typeof this.listeners[name] === 'function') {
            if (value !== null) {
                this.listeners[name](value);
            } else {
                this.listeners[name]();
            }
        }
    }
}