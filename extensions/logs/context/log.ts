import { getLogger } from "protobase";
const logger = getLogger()

export const log = (options: {
    message?: string, // message to log, can be anything
    from: string, // board, extensions, automations, etc
    name: string, // name of the entity that is logging, e.g. 'products', 'users', 'orders', etc
    data?: any, //data to log, can be anything
    level?: 'info' | 'error' | 'warn' | 'debug' | 'trace' | 'fatal'
    done?: () => void
}) => {
    const message = options.message
    const data = options.data || undefined
    const level = options.level || 'info'
    const done = options.done || (() => {})

    logger[level]({
        ...(data != undefined ? { data } : {}),
        from: {
            name: options.name,
            type: options.from
        }
    }, message)
    done()
}