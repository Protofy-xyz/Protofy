import { packageSerde } from "../serde"

export const MqttTransporter = (context) => {
    const { topicSub, mqtt, logger } = context

    const subscriber = (path, handler) => {
        topicSub(mqtt, path, handler)
    }

    topicSub(mqtt, 'agents/#', (message, topic) => packageSerde(topic, message, subscriber))
}
