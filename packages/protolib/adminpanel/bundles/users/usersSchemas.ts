import { z } from "zod";
import {hidden} from 'protolib/base'

export const UserSchema = z.object({
    username: z.string().email(),
    type: z.string().min(1),
    password: z.string().min(6),
    createdAt: hidden(z.string().min(1)),
    lastLogin: hidden(z.string().optional()),
    from: hidden(z.string().min(1))
}) 

export type UserType = z.infer<typeof UserSchema>;
