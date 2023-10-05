import { z } from "zod";

export const NoteSchema = z.object({
    id: z.string(),
    _deleted: z.boolean().optional(),
    title: z.string(),
    body: z.string()
});

export type NoteType = z.infer<typeof NoteSchema>;
