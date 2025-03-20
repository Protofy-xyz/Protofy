
import { getLogger } from 'protobase';
import protoInfraUrls from './../../protoinfra/utils/protoInfraUrls'
import { createMqttClient } from './../../protoinfra/utils/mqttTransportLayer'

const logger = getLogger()

export const subscribeToMessages = (projectId, username?, password?, cb?) => {
    createMqttClient(protoInfraUrls.whatsapp.mqtt, username, password, (client) => {
        const topic = `twilio/whatsapp/messages/in/${projectId}/#`
        client.subscribe(topic)
        client.on('message', (topic, message) => {
            if(topic.includes(projectId)){
                cb(topic, message.toString())
            }
        })
    })
}