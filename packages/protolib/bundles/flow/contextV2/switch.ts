import { getLogger } from 'protolib/base/logger';

const logger = getLogger()

export const flowSwitch = async ({condition, then, otherwise, error, after}) => {
    const _then = then ? then : () => {}
    const _otherwise = otherwise ? otherwise : () => {}
    const _error = error ? error : () => {}
    const _after = after ? after : () => {}

    try {
        if(condition) {
            return _then()
        } else {
            return _otherwise()
        }
    } catch(e) {
        logger.error({error: e}, "Error processing flow switch")
        _error()
    } finally {
        _after()
    }
}