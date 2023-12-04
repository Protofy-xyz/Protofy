const { after } = require('node:test');
let Zombie = require('zombie')

describe("Basic tests", () => {
    const browser = new Zombie()
    browser.site = 'http://127.0.0.1:8080/';

    afterAll(() => {
        browser.destroy()
    })

    beforeAll((done) => {
        browser.on('request', (request) => {
            // console.log(request.url)
            if (request.url.includes("_next/static/chunks/react-refresh.js")) {
                done()
            }
        })
        browser.visit('/', () => { })
    });

    it("should be able to interact with the web", () => {
        const content = browser.query('#__next')
        expect(content).not.toBeNull()
    })

    it("should detect login element at header and navigate to login page", () => {
        const loginElementId = "header-login-link"
        const loginElement = browser.query(`#${loginElementId}`)
        if (!loginElement) fail(`Login element with id "${loginElementId}" not found`)
        browser.clickLink(`#${loginElementId}`)
        expect(browser.location.href.split(browser.site)[1]).toBe("auth/login")
    })
})