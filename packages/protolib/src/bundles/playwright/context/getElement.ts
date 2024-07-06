import { getLogger } from 'protobase';
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
    const all = options.all ?? false

    if (!page) {
        throw new Error("getElement: page is required");
    }

    const onDone = options.onDone || (() => { });
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in getElement");
    });

    try {
        if (all) {
            const handles = await page.locator(selector).elementHandles()
            onDone(handles)
            return handles
        } else {
            const element = await page.locator(selector).first()
            const handle = await element.elementHandle()
            onDone(handle)
            return handle
        }
    } catch (err) {
        onError(err);
    }
}