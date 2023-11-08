import { z } from "zod";
import { Protofy } from 'protolib/base'
import { Schema, BaseSchema } from 'protolib/base'
import moment from "moment";
import { AutoModel } from 'protolib/base'

export const TaskSchema = z.object(Protofy("schema", {
    name: z.string().search().id().display().static(),
    path: z.string().generate(() => 'packages/app/bundles/custom/tasks/'),
    api: z.boolean().display().generate(() => false),
    apiRoute: z.string().optional().display(),
    params: z.record(z.string(), z.object({
        required: z.boolean().optional(),
        type: z.union([
            z.literal("string"),
            z.literal("number"),
            z.literal("boolean"),
            z.literal("array"),
            z.literal("object"),
            z.literal("any")
        ]),
    })).display().generate(()=>{return{}}),
    numExecutions: z.number().generate(() => 0)
}))

export type TaskType = z.infer<typeof TaskSchema>;
export const TaskModel = AutoModel.createDerived<TaskType>("TaskModel", TaskSchema);
