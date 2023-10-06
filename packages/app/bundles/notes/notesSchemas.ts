import { z } from "zod";
import {BaseSchema} from 'protolib/base'

export const BaseNoteSchema = z.object({
    title: z.string(),
    body: z.string()
}) 
export const NoteSchema = z.object({
    ...BaseSchema.shape,
    ...BaseNoteSchema.shape
});

export type NoteType = z.infer<typeof NoteSchema>;
