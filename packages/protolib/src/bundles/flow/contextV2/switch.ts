import { getLogger } from 'protobase';

const logger = getLogger()
type FlowSwitchProps = {
    condition: any
    then?: (condition) => any
    otherwise?: (condition) => any
    error?: (error, condition) => any
    after?: (condition) => any
}

export const flowSwitch = async ({condition, then, otherwise, error, after}:FlowSwitchProps) => {
    const _then = then ? then : () => {}
    const _otherwise = otherwise ? otherwise : () => {}
    const _error = error ? error : () => {}
    const _after = after ? after : () => {}

    try {
        if(condition) {
            return _then(condition)
        } else {
            return _otherwise(condition)
        }
    } catch(e) {
        logger.error({error: e}, "Error processing flow switch")
        _error(e, condition)
    } finally {
        _after(condition)
    }
}