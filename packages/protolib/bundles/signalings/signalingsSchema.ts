import { z } from "protolib/base";
import { Protofy, Schema, BaseSchema } from 'protolib/base'

Protofy("features", {})

export const BaseSignalingSchema = Schema.object(Protofy("schema", {
    clientId: z.string(),
    status: z.union([z.literal("online"), z.literal("offline")]),
    ts: z.number().generate(() => Date.now())
}))

export const SignalingSchema = Schema.object({
    ...BaseSchema.shape,
    ...BaseSignalingSchema.shape
});

export type SignalingType = z.infer<typeof SignalingSchema>;