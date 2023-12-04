const { after } = require('node:test');
let Zombie = require('zombie');

const protoBrowser = {
    visit: (browser, url) => {
        return new Promise((resolve, reject) => {
            browser.visit(url, () => { })
            browser.on("loaded", () => {
                resolve();
            });
            // Opcional: Rechazar la promesa si hay errores
            browser.on("error", (error) => {
                reject(error);
            });
        });
    },
    visitLink: (browser, selector) => {
        return new Promise((resolve, reject) => {
            browser.clickLink(selector, () => {});
            browser.on("loaded", () => {
                resolve();
            });
            // Opcional: Rechazar la promesa si hay errores
            browser.on("error", (error) => {
                reject(error);
            });
        });
    },
}

describe("Basic tests", () => {
    let browser;
    afterEach(() => {
        browser.destroy()
    })
    
    beforeEach(async () => {
        browser = new Zombie()
        browser.site = 'http://127.0.0.1:8080/';
        await protoBrowser.visit(browser, '/')
    })

    it("should be able to interact with the web", async () => {
        const content = browser.query('#__next')
        expect(content).not.toBeNull()
    })

    it("should have a public authentication interface", async () => {
        const loginElementId = "header-login-link"
        const loginElement = browser.query(`#${loginElementId}`)
        if (!loginElement) fail(`Login element with id "${loginElementId}" not found`)
        await protoBrowser.visitLink(browser, `#${loginElementId}`)
        expect(browser.location.href.split(browser.site)[1]).toBe("auth/login")
        expect(browser.query('#sign-in-email-input'), "Missing input at login form: email").not.toBeNull()
        expect(browser.query('#sign-in-password-input'), "Missing input at login form: password").not.toBeNull()
        expect(browser.query('#sign-up-btn'), "Missing sign up button at login").not.toBeNull()

    })
    // sign-up-btn
})