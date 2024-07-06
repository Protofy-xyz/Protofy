import { getLogger } from "../../../base";
const logger = getLogger()

export const log = (options: {
    message?: string,
    data?: any,
    level?: 'info' | 'error' | 'warn' | 'debug' | 'trace' | 'fatal'
    done?: () => void
}) => {
    const message = options.message
    const data = options.data || undefined
    const level = options.level || 'info'
    const done = options.done || (() => {})

    logger[level](data !== undefined ? {data: data}: {}, message)
    done()
}