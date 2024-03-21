import { SessionDataType } from 'protolib/api/lib/session'
import { ProtoModel } from 'protolib/base'
import { SignalingType, SignalingSchema } from "./signalingsSchema";

export class SignalingModel extends ProtoModel<SignalingModel>{
    // Parent class ProtoModel demands to have this
    constructor(data: SignalingType, session?: SessionDataType) {
        let initialData = { ...data, ts: data?.ts ?? Date.now() } // generates a timestamp
        super(initialData, SignalingSchema, session)
    }
    // Parent class ProtoModel demands to have this
    protected static _newInstance(data: any, session?: SessionDataType): SignalingModel {
        return new SignalingModel(data, session);
    }

    public static getApiOptions() {
        return {
            name: 'signalings',
            prefix: '/adminapi/v1/'
        }
    }
    get(key) {
        return this.data[key]
    }

    getSignalingEventData() {
        const data = this.getData()
        return {
            path: 'signaling',
            from: 'admin-api',
            user: 'system',
            payload: { ...data }
        }
    }

    getClientId(): string {
        return this.data["clientId"]
    }

    getStatus(): "online" | "offline" {
        return this.data["status"] ?? "offline"
    }

    getTimestamp(): number {
        return this.data["ts"]
    }
    getNotificationsTopic(action: string): string {
        // When autoapi creates element it generates an event (a part, uses generateEvent to generate another event in event model) send it through topic returned in this function
        let topic;
        switch (action) {
            case 'create':
                topic = "signaling/create"
                break;
            default:
                topic = super.getNotificationsTopic(action)
                break;
        }
        return topic
    }
}

export class SignalingCollection {
    items: SignalingType[];
    session;
    constructor(items: SignalingType[], session?: SessionDataType) {
        this.items = items
        this.session = session;
    }

    static load(items: SignalingType[], session?: SessionDataType): SignalingCollection {
        return new this(items, session);
    }

    getItems(): SignalingType[] {
        return this.items;
    }

    getLength(): number {
        return this.items?.length;
    }

    getLastStatus(clientsIds: string[]): Object { // clientIds = ["clien1", "client2"]
        // Returns last status of given clientIds list, if a clientId has no signaling, returns "offline" status
        const clientsSignalingEvents = this.getItems()?.filter((signalingEvent: SignalingType) => clientsIds?.includes((SignalingModel.load(signalingEvent) as SignalingModel).getClientId()))
        // Get last signaling event for each client 
        const lastStatusEvents = clientsSignalingEvents.reduce((total, currentSignal: SignalingType) => {
            const currentSignalModel = SignalingModel.load(currentSignal) as SignalingModel;
            const clientId = currentSignalModel.getClientId();
            const signalTs = currentSignalModel.getTimestamp();
            if (!total[clientId] || total[clientId].ts < signalTs) {
                total[clientId] = currentSignalModel.getData();
            }
            return total;
        }, {});
        return clientsIds.reduce((total, clientId) => { // Return data in format: { client1: "offline", client2: "online", ... }
            total[clientId] = (SignalingModel.load(lastStatusEvents[clientId]) as SignalingModel).getStatus()
            return total
        }, {})
    }
}