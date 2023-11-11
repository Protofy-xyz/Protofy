import {Protofy} from 'protolib/base'
import {ZodObject, z} from 'zod'
import {handler} from 'protolib/api'

const paramsSchema = z.object(Protofy("params", {{params}}
)) as ZodObject<any>

export type paramsType = z.infer<typeof paramsSchema>;

const do_task = async (params) => {
    return {

    }
}

export default (params:paramsType) => {
    paramsSchema.parse(params)
    return await do_task(params)
}