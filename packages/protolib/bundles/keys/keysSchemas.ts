import { z } from "protolib/base";
import { Schema } from 'protolib/base'
import { AutoModel } from 'protolib/base'

export const KeySchema = Schema.object({
	name: z.string().id().search(),
	value: z.string()
})

export type KeyType = z.infer<typeof KeySchema>;
export const KeyModel = AutoModel.createDerived<KeyType>("KeyModel", KeySchema);
