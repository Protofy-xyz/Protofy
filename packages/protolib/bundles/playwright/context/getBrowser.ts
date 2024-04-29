import { getLogger } from 'protolib/base/logger';
import { chromium, firefox, webkit } from 'playwright'; 

const logger = getLogger();

export const getBrowser = async (options: {
    browserType?: "chromium" | "firefox" | "webkit",
    onDone?: (browser, page) => void,
    onError?: (err) => void
}) => {
    const browserType = options.browserType || 'chromium'; 
    const onDone = options.onDone || (() => {});
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in getBrowser");
    });

    try {
        let browser;
        switch (browserType.toLowerCase()) {
            case 'firefox':
                browser = await firefox.launch();
                break;
            case 'webkit':
                browser = await webkit.launch();
                break;
            case 'chromium':
            default:
                browser = await chromium.launch();
                break;
        }
        const context = await browser.newContext();
        const page = await context.newPage();
        onDone(browser, page);
        return { browser, page}
    } catch (err) {
        logger.error({ error: err }, "Error in getBrowser");
        onError(err);
    }
}