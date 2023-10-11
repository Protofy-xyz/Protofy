import { z } from "zod";
import {Schema} from 'protolib/base'
import moment from "moment";


export const UserSchema = Schema.object({
    username: z.string().email().label('email').hint('user@example.com').static(),
    type: z.string().min(1).hint('user, admin, ...'),
    password: z.string().min(6).hint('**********').secret(),
    createdAt: z.string().min(1).hidden().generate((obj) => moment().toISOString()),
    lastLogin: z.string().optional().hidden(),
    from: z.string().min(1).hidden()
})

export type UserType = z.infer<typeof UserSchema>;
