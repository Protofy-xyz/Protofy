import { getLogger } from 'protobase';

const logger = getLogger();

export const toJson = async (options: {
    value?: string,
    onDone?: (result) => void,
    onError?: (err) => void
}) => {
    const value = options.value || {};  // Default to empty object if data is not provided
    const onDone = options.onDone || ((x) => x);
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in toJson");
    });

    try {
        const result = JSON.stringify(value, null, 4);
        return onDone(result);
    } catch (err) {
        logger.error({ error: err }, "Error in toJson");
        onError(err);
    }
}