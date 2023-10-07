import { z } from "zod";
import {BaseSchema} from '../../../base'

export const BaseUserSchema = z.object({
    username: z.string(),
    password: z.string(),
    type: z.string()
}) 
export const UserSchema = z.object({
    ...BaseSchema.shape,
    ...BaseUserSchema.shape
});

export type UserType = z.infer<typeof UserSchema>;
