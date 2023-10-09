import { z } from "zod";

export const UserSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    createdAt: z.string().min(1),
    lastLogin: z.string().optional(),
    from: z.string().min(1),
    type: z.string().min(1)
}) 

export type UserType = z.infer<typeof UserSchema>;
