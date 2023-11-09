import { z } from "zod";
import { Protofy, AutoModel, Schema } from 'protolib/base'
import moment from "moment";

export const DatabaseEntrySchema = Schema.object({
	key: z.string(),
	value: z.any()
})


export const DatabaseSchema = Schema.object(Protofy("schema", {
	name: z.string().id().search().display().static(),
	entries: z.array(DatabaseEntrySchema).generate(()=>[])
}))


export type DatabaseEntryType = z.infer<typeof DatabaseEntrySchema>;
export const DatabaseEntryModel = AutoModel.createDerived<DatabaseEntryType>("DatabaseEntryModel", DatabaseEntrySchema);

export type DatabaseType = z.infer<typeof DatabaseSchema>;
export const DatabaseModel = AutoModel.createDerived<DatabaseType>("DatabaseModel", DatabaseSchema, 'databases', '/api/v1/');