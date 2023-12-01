import { z } from "protolib/base";
import { Protofy } from 'protolib/base'
import { Schema, ProtoModel } from 'protolib/base'
import { SessionDataType } from "../../../api";

export const TaskSchema = z.object(Protofy("schema", {
    name: z.string().search().id().static(),
    path: z.string().generate(() => 'packages/app/bundles/custom/tasks/'),
    api: z.boolean().display(['add', 'edit']).generate(() => false),
    apiRoute: z.string().optional().display(['add', 'edit'])
}))


export type TaskType = z.infer<typeof TaskSchema>;
export class TaskModel extends ProtoModel<TaskModel> {
    constructor(data: TaskType, session?: SessionDataType) {
        super(data, TaskSchema, session);
    }

    getDefaultFilePath() {
        return '/packages/app/bundles/custom/tasks/'+this.data.name+'.ts'
    }

    private getExtraData(extraData) {
        if(!extraData) return {}

        return {
            numExecutions: extraData?.history?.total ?? 0,
            numRunning: extraData?.running?.total,
            status: extraData?.running?.total > 0 ? 'running' : 'idle'
        }
    }

    list(search?, session?, extraData?): any {
        if (search) {
            if (!super.list(search)) {
                return undefined
            }
        }

        return {...this.read(), ...this.getExtraData(extraData)}
    }

    read(extraData?): any {
        return {...super.read(), ...this.getExtraData(extraData)}
    }

    protected static _newInstance(data: any, session?: SessionDataType): TaskModel {
        return new TaskModel(data, session);
    }
}