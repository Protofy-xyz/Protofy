import { z } from "zod";
import { Protofy } from 'protolib/base'
import { Schema, BaseSchema, ProtoModel } from 'protolib/base'
import moment from "moment";
import { SessionDataType } from 'protolib/api/lib/session'


export const BaseTaskRunSchema = Schema.object(Protofy("schema", {
    task: z.string().search().display(),
    parameters: z.record(z.string()).display(), 
    who: z.string().search(), 
    startDate: z.string().generate((obj) => moment().toISOString()).search(), 
    endDate: z.string().optional().search(), 
    status: z.union([ 
        z.literal("running"),
        z.literal("error"),
        z.literal("done"),
    ]).display(),
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

    list(search?): any {
        if(search) {
            if(search.startsWith("task:")){
                const task = search.slice("task:".length).toLowerCase().split(" ")[0]
                if(this.data.task && this.data.task.toLowerCase() == task) {
                    return this.read();
                }
            } else {
                const searchFields = this.objectSchema.is('search').getFields()
                for(var i=0;i<searchFields.length;i++) {
                    if(((this.data[searchFields[i]]+"").toLowerCase()).includes(search.toLowerCase())) {
                        return this.read();
                    }
                }
            }
        } else {
            return this.read();
        }
    }

    protected static _newInstance(data: any, session?: SessionDataType): TaskRunModel {
        return new TaskRunModel(data, session);
    }
}
