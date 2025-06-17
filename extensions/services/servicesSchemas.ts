import { ProtoModel, Schema, z, SessionDataType, Protofy } from 'protobase'

Protofy("features", {
    "adminPage": "/services"
})

export const ServiceSchema = Schema.object(Protofy("schema", {
    name: z.string().search().id(),
    status: z.string().optional(),
    uptime: z.number().optional(),
    restarts: z.number().optional(),
    memory: z.number().optional(),
    cpu: z.number().optional(),
}))

Protofy("api", {
    "name": "services",
    "prefix": "/api/core/v1/"
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
