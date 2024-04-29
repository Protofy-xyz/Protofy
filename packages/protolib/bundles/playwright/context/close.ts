import { getLogger } from 'protolib/base/logger';
import { chromium, firefox, webkit } from 'playwright'; 

const logger = getLogger();

export const close = async (options: {
    browser: any,
    onDone?: () => void,
    onError?: (err) => void
}) => {
    const browser = options.browser
    if(!browser) {
        throw new Error("close: browser is required");
    }

    const onDone = options.onDone || (() => {});
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in close");
    });

    try {
        await browser.close()
        onDone();
    } catch (err) {
        logger.error({ error: err }, "Error in close");
        onError(err);
    }
}