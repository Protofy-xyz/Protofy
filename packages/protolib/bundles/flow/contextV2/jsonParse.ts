import { getLogger } from 'protolib/base/logger';

const logger = getLogger();

export const jsonParse = async (options: {
    data?: string,
    onDone?: (result) => void,
    onError?: (err) => void
}) => {
    const data = options.data || '{}';  // Default to empty JSON object if data is not provided
    const onDone = options.onDone || ((x) => x);
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in jsonParse");
    });

    try {
        const result = JSON.parse(data);
        return onDone(result);
    } catch (err) {
        logger.error({ error: err }, "Error in jsonParse");
        onError(err);
    }
}