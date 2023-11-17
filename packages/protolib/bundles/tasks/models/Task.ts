import { z } from "zod";
import { Protofy } from 'protolib/base'
import { Schema, ProtoModel } from 'protolib/base'
import { SessionDataType } from "../../../api";

export const TaskSchema = z.object(Protofy("schema", {
    name: z.string().search().id().display().static(),
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

    protected static _newInstance(data: any, session?: SessionDataType): TaskModel {
        return new TaskModel(data, session);
    }
}