import { getLogger } from '../../../base/logger';
import { chromium, firefox, webkit } from 'playwright'; 

const logger = getLogger();

export const navigate = async (options: {
    url?: string,
    page: any,
    onDone?: () => void,
    onError?: (err) => void
}) => {
    const url = options.url
    const page = options.page
    if(!url || !page) {
        throw new Error("navigate: url and page are required");
    }

    const onDone = options.onDone || (() => {});
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in navigate");
    });

    try {
        await page.goto(url);
        return onDone();
    } catch (err) {
        logger.error({ error: err }, "Error in navigate");
        onError(err);
    }
}