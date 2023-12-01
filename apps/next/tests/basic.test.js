
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

const { after } = require('node:test');
let Zombie = require('zombie')

describe("Basic tests", () => {
    const browser = new Zombie()
    browser.site = 'http://127.0.0.1:8080/'; // 0.0.0.0:8080
    const onRequest = (request, done) => {
        // console.log(request.url)
        if(request.url.includes("_next/static/chunks/react-refresh.js")) {
            browser.removeListener('request', onRequest);
            done()
        }
    }

    afterAll(() => {
        browser.destroy()
    })
    beforeAll((done) => {
        browser.on('request', (request) => onRequest(request, done))
        browser.visit('/', () => {})
    });

    it("should be able to interact with the web", () => {
        const content = browser.query('#__next')
        expect(content).not.toBeNull()
    })
})