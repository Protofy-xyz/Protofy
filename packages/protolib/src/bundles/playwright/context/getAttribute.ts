import { getLogger } from 'protobase';
import { chromium, firefox, webkit } from 'playwright'; 

const logger = getLogger();

export const getAttribute = async (options: {
    element?: any,
    attribute?: string,
    onDone?: (value) => void,
    onError?: (err) => void
}) => {
    const element = options.element
    const attribute = options.attribute

    if(!element || !attribute) {
        throw new Error("getAttribute: element and attribute are required");
    }

    const onDone = options.onDone || (() => {});
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in getAttribute");
    });

    try {
        const result = await element.getAttribute(attribute)
        onDone(result);
        return result
    } catch (err) {
        logger.error({ error: err }, "Error in getAttribute");
        onError(err);
    }
}