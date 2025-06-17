import { z, Schema, AutoModel, Protofy } from "protobase";

Protofy("features", {
    "adminPage": "/keys"
})

export const KeySchema = Schema.object(Protofy("schema", {
	name: z.string().id().search(),
	value: z.string().display(['add', 'edit'])
}))

Protofy("api", {
    "name": "keys",
    "prefix": "/api/core/v1/"
})

export type KeyType = z.infer<typeof KeySchema>;
export const KeyModel = AutoModel.createDerived<KeyType>("KeyModel", KeySchema);
