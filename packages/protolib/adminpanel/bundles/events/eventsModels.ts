import { EventSchema, EventType } from "./eventsSchemas"
import { SessionDataType } from 'protolib/api/lib/session'
import { ProtoModel, ProtoCollection } from 'protolib/base'

export class EventModel extends ProtoModel<EventModel> {
    constructor(data: EventType, session?: SessionDataType) {
        super(data, session);
    }

    protected static _newInstance(data: any, session?: SessionDataType): EventModel {
        return new EventModel(data, session);
    }

    validate(): this {
        EventSchema.parse(this.data); //validate
        return this;
    }
}

export class EventCollection extends ProtoCollection<EventModel> {
    constructor(models: EventModel[]) {
        super(models)
    }
}