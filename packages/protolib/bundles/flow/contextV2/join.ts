import { getLogger } from 'protolib/base/logger';

const logger = getLogger();

export const join = async (options: {
    list?: any[],
    separator?: string,
    onDone?: (result) => void,
    onError?: (err) => void
}) => {
    const list = options.list || [];
    const separator = options.separator || "\n";
    const onDone = options.onDone || (() => { });
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in join");
    });

    try {
        const result = list.join(separator == "\\n" ? "\n" : (separator == "\\t" ? "\t" : separator));
        onDone(result);
    } catch (err) {
        logger.error({ error: err }, "Error in join");
        onError(err);
    }
}