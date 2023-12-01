import { z } from "protolib/base";
import { Protofy } from 'protolib/base'
import { Schema, BaseSchema, ProtoModel } from 'protolib/base'
import moment from "moment";
import { SessionDataType } from 'protolib/api/lib/session'


export const BaseTaskRunSchema = Schema.object(Protofy("schema", {
    task: z.string().search(),
    parameters: z.record(z.string()), 
    who: z.string().search(), 
    startDate: z.string().generate((obj) => moment().toISOString()).search(), 
    endDate: z.string().optional().search(), 
    status: z.union([ 
        z.literal("running"),
        z.literal("error"),
        z.literal("done"),
    ]),
    error: z.string().optional()
}))

export const TaskRunSchema = z.object({
    ...BaseSchema.shape,
    ...BaseTaskRunSchema.shape
});

export type TaskRunType = z.infer<typeof TaskRunSchema>;

export class TaskRunModel extends ProtoModel<TaskRunModel> {
    constructor(data: TaskRunType, session?: SessionDataType) {
        super(data, TaskRunSchema, session);
    }

    //TODO: getapi

    toError(errorMsg) {
        return new TaskRunModel({
            ...this.getData(),
            status: 'error',
            endDate: moment().toISOString(),
            error: errorMsg,
        }, this.session)
    }

    toSuccess() {
        return new TaskRunModel({
            ...this.getData(),
            status: 'success',
            endDate: moment().toISOString(),
        }, this.session)
    }

    protected static _newInstance(data: any, session?: SessionDataType): TaskRunModel {
        return new TaskRunModel(data, session);
    }
}
