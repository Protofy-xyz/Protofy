import { AutoModel, Schema, z } from 'protobase'

export const CardSchema = Schema.object({
    name: z.string().id(),
    label: z.string().optional(),
    type: z.string(),
    description: z.string().optional(),
    rules: z.array(z.string()).optional(),
    params: z.record(z.string(), z.any()).optional(),
    content: z.string().optional()
})

export type CardType = z.infer<typeof CardSchema>;
export const CardModel = AutoModel.createDerived<CardType>("CardModel", CardSchema);

export const BoardSchema = Schema.object({
    name: z.string().hint("room, system, controller, ...").regex(/^[a-z0-9_]+$/, "Only lower case chars, numbers or _").static().id(),
    layouts: z.any().optional().hidden(),
    cards: z.array(CardSchema).optional().hidden(),
    rules: z.array(z.string()).optional().hidden(),
})

export type BoardType = z.infer<typeof BoardSchema>;
export const BoardModel = AutoModel.createDerived<BoardType>("DeviceDefinitionModel", BoardSchema);