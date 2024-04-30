import { getLogger } from 'protolib/base/logger';
import { chromium, firefox, webkit } from 'playwright'; 

const logger = getLogger();

export const getBrowser = async (options: {
    browserType?: "chromium" | "firefox" | "webkit",
    visible?: boolean,
    onDone?: (browser, page) => void,
    onError?: (err) => void
}) => {
    const browserType = options.browserType || 'chromium'; 
    const onDone = options.onDone || ((browser, page) => ({browser, page}));
    const visible = options.visible ?? true;
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in getBrowser");
    });

    try {
        let browser;
        switch (browserType.toLowerCase()) {
            case 'firefox':
                browser = await firefox.launch({ headless: !visible });
                break;
            case 'webkit':
                browser = await webkit.launch({ headless: !visible});
                break;
            case 'chromium':
            default:
                browser = await chromium.launch({ headless: !visible});
                break;
        }
        const context = await browser.newContext();
        const page = await context.newPage();
        return onDone(browser, page);
    } catch (err) {
        logger.error({ error: err }, "Error in getBrowser");
        onError(err);
    }
}