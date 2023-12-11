const execSync = require('child_process').execSync
let Zombie = require('zombie');

const protoBrowser = {
    visit: (browser, url) => {
        return new Promise((resolve, reject) => {
            browser.visit(url, () => { })
            browser.on("loaded", () => {
                resolve();
            });
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
            browser.on("error", (error) => {
                reject(error);
            });
        });
    },
    clickButton: (browser, selector) => {
        try {
            browser.pressButton(selector);
        } catch (e) {
            throw ("Error: Button element with selector " + selector + " not found.")
        }
    },
    submit: (browser, selector) => {
        try {
            browser.query(selector)?.submit();
        } catch (e) {
            throw ("Error: Form element with selector " + selector + " not found.")
        }
    },
    waitForElement: (browser, selector) => {
        return new Promise((resolve, reject) => {
            function verifyCondition() {
                if (browser && browser.query(selector)) {
                    resolve()
                    clearInterval(interval);
                }
            }
            let interval = setInterval(verifyCondition, 100);
        })
    },
    wait2BReady: (path, element_id) => {
        return new Promise((resolve, reject) => {
            function isReady() {
                let isEnabled = execSync(`curl -s http://127.0.0.1:8080${path} | grep -q 'id="${element_id}"' && echo true || echo false`, { encoding: 'utf-8' }).trim()
                if (isEnabled === "true") {
                    clearInterval(interval);
                    resolve(true)
                }
            }
            let interval = setInterval(isReady, 100)
        })
    }
}

describe("Check routes", () => {
    it("should have a public authentication interface", async () => {
        expect(await protoBrowser.wait2BReady("/auth/login", "sign-in-btn")).toBe(true)
    })

    it("should have a public sign up interface", async () => {
        expect(await protoBrowser.wait2BReady("/auth/register", "sign-up-btn")).toBe(true)
    })
})


describe("Basic tests", () => {
    let browser;
    const navigateToLogin = async () => {
        await protoBrowser.visitLink(browser, `#header-login-link`)
    }

    const navigateToRegister = async () => {
        await navigateToLogin();
        await protoBrowser.visitLink(browser, '#sign-up-link')
    }

    const hasElement = async (selector) => Boolean(browser.query(selector))
    const fillInput = async (selector, value) => {
        browser.query(selector).value = value;
    }

    afterEach(() => {
        browser.destroy()
    })

    beforeEach(async () => {
        browser = new Zombie()
        browser.site = 'http://127.0.0.1:8080/';
        await protoBrowser.visit(browser, '/')
    })

    it("should be able to interact with the web", async () => {
        expect(hasElement('#__next')).toBeTruthy()
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

    it.skip("should create a user using sign up interface", async () => {
        console.log('Test start!')
        const email = "example5@mail.com"
        await navigateToRegister()
        console.log('At REGISTER!')
        fillInput("#sign-up-email-input", email)
        fillInput("#sign-up-password-input", "changeme1234")
        fillInput("#sign-up-repassword-input", "changeme1234")
        console.log('CLICK!')
        await browser.pressButton("#sign-up-btn")  
        console.log('BROWSER: ', browser.query("#header-session-user-id"))
        // expect(browser.location.href.split(browser.site)[1]).toBe("/")
        // expect(browser.query("#header-session-user-id>p").textContent).toBe(email)
    }, 10000)
})