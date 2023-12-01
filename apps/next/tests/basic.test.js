
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

let Zombie = require('zombie')

describe("Basic tests", () => {
    const browser = new Zombie()
    // browser.on('event', (event, target) => {console.log('EVENT RECIEVED', JSON.stringify(event))})
    browser.site = 'http://127.0.0.1:8080/'; // 0.0.0.0:8080
    beforeAll((done) => {
        browser.on('request', (request) => {
            // console.log(request.url)
            if(request.url.includes("_next/static/chunks/react-refresh.js")) {
                done()
            }
        })
        browser.visit('/', () => {
            done()
        })
    });
    it("should be able to interact with the web", () => {
        const content = browser.query('#__next')
        expect(content).not.toBeNull()
    })
})