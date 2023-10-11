import { z } from "zod";
import {Schema} from 'protolib/base'


export const UserSchema = Schema.object({
    username: z.string().email().label('email'),
    type: z.string().min(1),
    password: z.string().min(6),
    createdAt: z.string().min(1).hidden().generate("fecha"),
    lastLogin: z.string().optional().hidden(),
    from: z.string().min(1).hidden()
})

export type UserType = z.infer<typeof UserSchema>;
