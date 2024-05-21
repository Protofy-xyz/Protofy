import React, { useEffect } from 'react'
import { useMqttState } from 'mqtt-react-hooks';
import { Connector } from 'mqtt-react-hooks';
import { SignalingModel } from 'protolib/bundles/signalings';
import { generateEvent } from 'protolib/bundles/events/eventsLibrary';
import {getBrokerUrl} from '../../lib/Broker'

export const MqttSignaling = ({ clientId, children }: any) => {
    const brokerUrl = getBrokerUrl()
    const { connectionStatus } = useMqttState();

    const mqttSignaling = async () => {
        if (connectionStatus == 'Connected' && clientId) {
            const status = 'online'
            const signalingModel = SignalingModel.load({ clientId, status}) as SignalingModel
            await generateEvent(signalingModel.getSignalingEventData());
        }
    }

    useEffect(() => {
        if (connectionStatus && clientId) {
            mqttSignaling()
        }
    }, [connectionStatus])


    return (
        <Connector brokerUrl={brokerUrl} options={
            {
                will: { 
                    topic: 'signaling/status',
                    payload: JSON.stringify({
                        clientId: clientId,
                        status: 'offline',
                    }),
                    qos: 1,
                    retain: false,
                },
            }}>
            {children}
        </Connector>
    )

}