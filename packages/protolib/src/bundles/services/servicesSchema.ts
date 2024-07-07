import { ProtoModel, Schema, z } from 'protobase'
import { SessionDataType } from "protonode";

export const ServiceSchema = Schema.object({
    name: z.string().search().id(),
    status: z.string().optional(),
    uptime: z.number().optional(),
    restarts: z.number().optional(),
    memory: z.number().optional(),
    cpu: z.number().optional(),
}) 

export type PageType = z.infer<typeof ServiceSchema>;

export type ObjectType = z.infer<typeof ServiceSchema>;
export class ServiceModel extends ProtoModel<ServiceModel> {
    constructor(data: ObjectType, session?: SessionDataType) {
        super(data, ServiceSchema, session, "Service");
    }

    protected static _newInstance(data: any, session?: SessionDataType): ServiceModel {
        return new ServiceModel(data, session);
    }
}
