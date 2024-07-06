import { getLogger } from 'protobase';
import { chromium, firefox, webkit } from 'playwright'; 
import {join} from 'path';

const logger = getLogger();

export const screenshot = async (options: {
    directory?: string,
    filename?: string,
    fullPage?: boolean,
    page: any,
    onDone?: () => void,
    onError?: (err) => void
}) => {
    const directory = options.directory ?? '/'
    const filename = options.filename ?? 'screenshot'
    const fullPage = options.fullPage ?? true
    const page = options.page

    if(!page) {
        throw new Error("screenshot: page is required");
    }

    const onDone = options.onDone || (() => {});
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in screenshot");
    });

    try {
        const path = join('../../', directory, filename+'.png')
        await page.screenshot({path: path, fullPage: fullPage});
        onDone();
    } catch (err) {
        logger.error({ error: err }, "Error in screenshot");
        onError(err);
    }
}