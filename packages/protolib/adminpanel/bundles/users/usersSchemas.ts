import { z } from "zod";

export const UserSchema = z.object({
    username: z.string(),
    password: z.string(),
    createdAt: z.string(),
    lastLogin: z.string().optional(),
    from: z.string(),
    type: z.string()
}) 

export type UserType = z.infer<typeof UserSchema>;
