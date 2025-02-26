import { ProtoModel, Schema, optional, z } from 'protobase'
import { SessionDataType } from "protonode";

export const AutomationSchema = Schema.object({
    name: z.string().search().id(),
    params: z.any().optional(),
    responseMode: z.enum(['instant', 'wait', 'manual']).optional(),
}) 

export type AutomationType = z.infer<typeof AutomationSchema>;

export type ObjectType = z.infer<typeof AutomationSchema>;
export class AutomationModel extends ProtoModel<AutomationModel> {
    constructor(data: ObjectType, session?: SessionDataType) {
        super(data, AutomationSchema, session, "Page");
    }

    protected static _newInstance(data: any, session?: SessionDataType): AutomationModel {
        return new AutomationModel(data, session);
    }
}
