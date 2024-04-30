import { getLogger } from '../../../base/logger';

const logger = getLogger();

export const split = async (options: {
    text?: string,
    separator?: string,
    onDone?: (list) => void,
    onError?: (err) => void
}) => {
    const text = options.text || '';
    const separator = options.separator || "\n";
    const onDone = options.onDone || (() => { });
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in split");
    });

    try {
        const list = text.split(separator == "\\n" ? "\n" : (separator == "\\t" ? "\t" : separator));
        onDone(list);
    } catch (err) {
        logger.error({ error: err }, "Error in split");
        onError(err);
        return;
    }
}