const { chromium, firefox, webkit } = require('playwright');

(async () => {
    const browser = await chromium.launch();  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await page.goto('http://example.com');
    await page.screenshot({
        path: './test-artifacts/landing-page.png',
        fullPage: true
    });
    await browser.close();
})();