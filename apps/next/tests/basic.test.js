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
            browser.clickLink(selector, () => { });
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

    const navigateToLogin = async () => {
        const loginElementId = "header-login-link"
        const loginElement = browser.query(`#${loginElementId}`)
        if (!loginElement) fail(`Login element with id "${loginElementId}" not found`)
        await protoBrowser.visitLink(browser, `#${loginElementId}`)
    }

    const navigateToRegister = async () => {
        await navigateToLogin();
        await protoBrowser.visitLink(browser, '#sign-up-link')
    }

    const hasElement = async (selector) => Boolean(browser.query(selector))

    afterEach(() => {
        browser.destroy()
    })

    beforeEach(async () => {
        browser = new Zombie()
        browser.site = 'http://127.0.0.1:8080/';
        await protoBrowser.visit(browser, '/')
    })

    it("should be able to interact with the web", async () => {
        expect(hasElement('#__next'))
    })

    it("should have a public authentication interface", async () => {
        await navigateToLogin();
        expect(browser.location.href.split(browser.site)[1]).toBe("auth/login")
        expect(hasElement('#sign-in-email-input'), "Missing input at login form: email").toBeTruthy()
        expect(hasElement('#sign-in-password-input'), "Missing input at login form: password").toBeTruthy()
        expect(hasElement('#sign-in-btn'), "Missing sign in button at login").toBeTruthy()
        expect(hasElement('#sign-up-link'), "Missing sign up link at login").toBeTruthy()

    })

    it("should have a public sign up interface", async () => {
        await navigateToRegister()
        expect(browser.location.href.split(browser.site)[1]).toBe("auth/register")
        expect(hasElement('#sign-up-email-input'), "Missing input at register form: email").toBeTruthy()
        expect(hasElement('#sign-up-password-input'), "Missing input at register form: password").toBeTruthy()
        expect(hasElement('#sign-up-repassword-input'), "Missing input at register form: repassword").toBeTruthy()
        expect(hasElement('#sign-up-btn'), "Missing sign up button at register").toBeTruthy()
        expect(hasElement('#sign-in-link'), "Missing sign in link at register").toBeTruthy()
    })

    it("should create a user using sign up interface", () => { })
})
