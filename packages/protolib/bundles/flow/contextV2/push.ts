import { getLogger } from '../../../base/logger';

const logger = getLogger();

export const push = async (options: {
    list?: any[],
    item?: any,
    onDone?: (list) => void,
    onError?: (err) => void
}) => {
    const list = options.list || [];
    const item = options.item
    const onDone = options.onDone || (() => { });
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in push");
    });

    try {
        onDone([...list, item]);
    } catch (err) {
        logger.error({ error: err }, "Error in push");
        onError(err);
    }
}