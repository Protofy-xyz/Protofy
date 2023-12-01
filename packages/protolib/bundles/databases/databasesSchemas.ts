import { z } from "protolib/base";
import { Protofy, AutoModel, Schema } from 'protolib/base'
import moment from "moment";
import { ProtoModel } from "../../base";
import { SessionDataType } from "../../api";

export const DatabaseEntrySchema = Schema.object({
	key: z.string(),
	value: z.any()
})

export const DatabaseSchema = Schema.object(Protofy("schema", {
	name: z.string().id().search().static(),
	entries: z.array(DatabaseEntrySchema).generate(()=>[])
}))

export type DatabaseEntryType = z.infer<typeof DatabaseEntrySchema>;

export class DatabaseEntryModel extends ProtoModel<DatabaseEntryModel> {
    constructor(data: DatabaseEntryType, session?: SessionDataType) {
        super(data, DatabaseEntrySchema, session);
    }

	list(search?): any {
        if(search) {
			if(JSON.stringify(this.data).toLowerCase().includes(search.toLowerCase())) {
				return this.read()
			}
        } else {
            return this.read();
        }
    }

    protected static _newInstance(data: any, session?: SessionDataType): DatabaseEntryModel {
        return new DatabaseEntryModel(data, session);
    }
}

export type DatabaseType = z.infer<typeof DatabaseSchema>;
export const DatabaseModel = AutoModel.createDerived<DatabaseType>("DatabaseModel", DatabaseSchema, 'databases', '/api/v1/');