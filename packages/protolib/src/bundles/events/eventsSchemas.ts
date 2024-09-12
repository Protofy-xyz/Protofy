import moment from "moment";
import { SessionDataType } from "protonode";
import { ProtoModel, z, Protofy, BaseSchema} from "protobase";

export const BaseEventSchema = z.object(Protofy("schema", {
    path: z.string().search().groupIndex("path", "return data.path.split('/').reduce((acc, curr, index) => (acc.push(index === 0 ? curr : acc[index - 1] + '/' + curr), acc), [])"), //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
    from: z.string().search(), // system entity where the event was generated (next, api, cmd...)
    user: z.string().generate((obj) => 'me').search(), // the original user that generates the action, 'system' if the event originated in the system itself
    environment: z.enum(['dev', 'prod']).optional(), // the environment where the event was generated (dev, prod, ...
    payload: z.record(z.string(), z.any()).search(), // event payload, event-specific data
    ephemeral: z.boolean().optional(), // if true, the event will not be stored in the database
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

    list(search?, session?, extraData?, params?): any {
        if(params && params.filter && params.filter.path) {
            const {path, ...filter} = params.filter
            if(!this.data.path || !this.data.path.startsWith || !this.data.path.startsWith(path)) { 
                return
            }

            params = {
                ...params,
                filter: {
                    ...filter,
                }
            }
        }

        return super.list(search, session, extraData, params)
    }

    getEnvironment() {
        if(this.data.environment == 'dev' || this.data.environment == 'prod') {
            return this.data.environment 
        }

        return '*'
    }

    getNotificationsTopic(action: string): string {
        return `notifications/${this.getModelName()}/${action}/${this.data.path}`
    }


    protected static _newInstance(data: any, session?: SessionDataType): EventModel {
        return new EventModel(data, session);
    }
}
