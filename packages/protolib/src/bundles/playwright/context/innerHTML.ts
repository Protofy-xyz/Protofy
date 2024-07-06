import { getLogger } from '../../../base/logger';
import { chromium, firefox, webkit } from 'playwright'; 

const logger = getLogger();

export const innerHTML = async (options: {
    element?: any,
    onDone?: (html) => void,
    onError?: (err) => void
}) => {
    const element = options.element

    if(!element) {
        throw new Error("innerHTML: element is required");
    }

    const onDone = options.onDone || (() => {});
    const onError = options.onError

    try {
        const result = await element.innerHTML()
        onDone(result);
        return result
    } catch (err) {
        if(onError) {
            onError(err);
        } else {
            throw new Error("Error in innerHTML: "+err.message);
        }
    }
}