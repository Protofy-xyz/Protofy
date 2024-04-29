import { getLogger } from 'protolib/base/logger';

const logger = getLogger();

export const rewire = async (options: {
    value?: any,
    name?: string,
    onDone?: (x) => void,
    onError?: (err) => void
}) => {
    const value = options.value
    const onDone = options.onDone || (() => { });
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in rewire");
    });

    try {
        onDone(value);
    } catch (err) {
        logger.error({ error: err }, "Error in rewire");
        onError(err);
    }
}