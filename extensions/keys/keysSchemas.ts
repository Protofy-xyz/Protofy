import { z, Schema, AutoModel } from "protobase";

export const KeySchema = Schema.object({
	name: z.string().id().search(),
	value: z.string().display(['add', 'edit'])
})

export type KeyType = z.infer<typeof KeySchema>;
export const KeyModel = AutoModel.createDerived<KeyType>("KeyModel", KeySchema);
