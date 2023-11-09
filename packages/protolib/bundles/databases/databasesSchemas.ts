import { z } from "zod";
import { Protofy, AutoModel, Schema } from 'protolib/base'
import moment from "moment";

export const DatabaseSchema = Schema.object(Protofy("schema", {
	name: z.string().id().search().display().static()
}))


export type DatabaseType = z.infer<typeof DatabaseSchema>;
export const DatabaseModel = AutoModel.createDerived<DatabaseType>("DatabaseModel", DatabaseSchema, 'databases', '/api/v1/');