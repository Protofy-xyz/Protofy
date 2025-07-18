import { ProtoModel, Protofy, AutoModel, Schema, z, SessionDataType } from "protobase";

export const DatabaseEntrySchema = Schema.object({
	key: z.string(),
	value: z.any()
})

Protofy("features", {
    "adminPage": "/databases"
})

export const DatabaseSchema = Schema.object(Protofy("schema", {
	name: z.string().id().search().static(),
	entries: z.array(DatabaseEntrySchema).generate(()=>[])
}))

Protofy("api", {
    "name": "databases",
    "prefix": "/api/core/v1/"
})

export type DatabaseEntryType = z.infer<typeof DatabaseEntrySchema>;

export class DatabaseEntryModel extends ProtoModel<DatabaseEntryModel> {
    constructor(data: DatabaseEntryType, session?: SessionDataType) {
        super(data, DatabaseEntrySchema, session, 'Database');
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