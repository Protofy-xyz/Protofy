import { AutoModel, Schema, z } from 'protobase'

export const ChatbotSchema = Schema.object({
    name: Schema.string().id().static()
}) 

export type ChatbotType = z.infer<typeof ChatbotSchema>;
export const ChatbotModel = AutoModel.createDerived<ChatbotType>("ChatbotModel", ChatbotSchema);
