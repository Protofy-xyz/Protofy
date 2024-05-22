import moment from "moment";
import { SessionDataType } from "../../api";
import { ProtoModel, z, Protofy, BaseSchema} from "../../base";

export const BaseEventSchema = z.object(Protofy("schema", {
    path: z.string().search(), //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
    from: z.string().search(), // system entity where the event was generated (next, api, cmd...)
    user: z.string().generate((obj) => 'me').search(), // the original user that generates the action, 'system' if the event originated in the system itself
    environment: z.enum(['dev', 'prod']).optional(), // the environment where the event was generated (dev, prod, ...
    payload: z.record(z.string(), z.any()).search(), // event payload, event-specific data
    created: z.string().generate((obj) => moment().toISOString()).search().indexed(), // event date (iso)
}))

export const EventSchema = z.object({
    ...BaseSchema.shape,
    ...BaseEventSchema.shape
});

export type EventType = z.infer<typeof EventSchema>;
export class EventModel extends ProtoModel<EventModel> {
    constructor(data: EventType, session?: SessionDataType) {
        super(data, EventSchema, session, "Event");
    }

    getEnvironment() {
        if(this.data.environment == 'dev' || this.data.environment == 'prod') {
            return this.data.environment 
        }

        return '*'
    }

    protected static _newInstance(data: any, session?: SessionDataType): EventModel {
        return new EventModel(data, session);
    }
}
