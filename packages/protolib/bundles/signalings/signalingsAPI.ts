import { API } from 'protolib/base'
import { Application } from 'express';
import { getServiceToken } from "protolib/api/lib/serviceToken";
import { SignalingCollection, SignalingModel } from "./SignalingModel";
import { generateEvent } from "protolib/bundles/events/eventsLibrary";
import { EventType } from "protolib/bundles/events";

export const SignalingAPI = (app: Application, context) => {
    const { topicSub, topicPub } = context;

    app.post('/adminapi/v1/signalings/clients/status', async (req, res) => {
        const { clientIds } = req.body;
        const { data: events } = await API.get('/adminapi/v1/events/signaling/list?token=' + getServiceToken())
        if (!events) {
            res.send("Error getting client status")
            return
        }
        const signalingEvents = events.map((event: EventType) => SignalingModel.load(event.payload).getData()) // Transform eventType[] into signalingType[]
        const clientsStatus = (SignalingCollection.load(signalingEvents) as SignalingCollection).getLastStatus(clientIds)
        res.send(clientsStatus)
    })


    topicSub('signaling/status', (async (message: string, topic: string) => {
        // Receive LWT of mqtt that has clientId, and status (should be 'offline'), and call endpoint to save event
        const { clientId, status } = JSON.parse(message)
        if (!clientId || !status) return;
        let signalingModel = SignalingModel.load({ clientId, status }) as SignalingModel
        await generateEvent(
            (signalingModel).getSignalingEventData(),
            getServiceToken()
        );
    }))

    topicSub('notifications/event/create/#', (async (message: string, topic: string) => {
        // Subscribed to topic when device uses signaling
        const msg = JSON.parse(message)
        if (msg?.path === "signaling") {
            const signalingModel = SignalingModel.load(msg?.payload) as SignalingModel
            // Redirect default notification of event creation to specific topic
            topicPub(signalingModel.getNotificationsTopic('create'), JSON.stringify(signalingModel.getData()))
        }
    }))
}