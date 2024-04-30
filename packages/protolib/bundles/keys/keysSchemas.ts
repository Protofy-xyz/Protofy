import { z, Schema, AutoModel } from "../../base";

export const KeySchema = Schema.object({
	name: z.string().id().search(),
	value: z.string()
})

export type KeyType = z.infer<typeof KeySchema>;
export const KeyModel = AutoModel.createDerived<KeyType>("KeyModel", KeySchema);
