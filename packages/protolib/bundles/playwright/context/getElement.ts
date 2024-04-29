import { getLogger } from 'protolib/base/logger';
import { chromium, firefox, webkit } from 'playwright';
import { join } from 'path';

const logger = getLogger();

export const getElement = async (options: {
    selector?: string,
    page: any,
    all?: boolean,
    onDone?: (element) => void,
    onError?: (err) => void
}) => {
    const selector = options.selector ?? ''
    const page = options.page
    const all = options.all ?? true

    if (!page) {
        throw new Error("getElement: page is required");
    }

    const onDone = options.onDone || (() => { });
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in getElement");
    });

    try {
        if (all) {
            await page.$$eval(selector, (elements) => {
                onDone(elements)
            });
        } else {
            await page.$eval(selector, (element) => {
                onDone(element)
            });
        }
    } catch (err) {
        onError(err);
    }
}