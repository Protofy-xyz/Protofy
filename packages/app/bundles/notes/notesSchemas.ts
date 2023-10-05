import { z } from "zod";
import {BaseSchema} from 'protolib/base'

export const NoteSchema = z.object({
    ...BaseSchema.shape,
    title: z.string(),
    body: z.string()
});

export type NoteType = z.infer<typeof NoteSchema>;
