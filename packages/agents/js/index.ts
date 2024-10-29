import { ProtoMqttAgent } from "./ProtoMqttAgent";

export class ProtoAgent {
    static mqtt(name: string): ProtoMqttAgent {
        return new ProtoMqttAgent(name);
    }

    // Future HTTP agent implementation
    // static http(name) {
    //   return new ProtoHttpAgent(name);
    // }
}
