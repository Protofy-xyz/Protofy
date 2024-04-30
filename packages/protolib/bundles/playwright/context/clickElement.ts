import { getLogger } from 'protolib/base/logger';
import { chromium, firefox, webkit } from 'playwright'; 

const logger = getLogger();

export const clickElement = async (options: {
    element?: any,
    onDone?: () => void,
    onError?: (err) => void
}) => {
    const element = options.element

    if(!element) {
        throw new Error("clickElement: element is required");
    }

    const onDone = options.onDone || (() => {});
    const onError = options.onError

    try {
        await element.click()
        onDone();
    } catch (err) {
        if(onError) {
            onError(err);
        } else {
            throw new Error("Error in clickElement: "+err.message);
        }
    }
}