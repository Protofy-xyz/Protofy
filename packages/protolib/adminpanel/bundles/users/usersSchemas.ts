import { z } from "zod";
import {ProtoSchema} from 'protolib/base'


export const UserSchema = ProtoSchema.object({
    username: z.string().email().label('email'),
    type: z.string().min(1),
    password: z.string().min(6),
    createdAt: z.string().min(1).hidden(),
    lastLogin: z.string().hidden(),
    from: z.string().min(1).hidden()
})

export type UserType = z.infer<typeof UserSchema>;
