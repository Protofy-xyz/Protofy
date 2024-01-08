const { execSync } = require('child_process');
const path = require('path')
const fs = require('fs')
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { v4: uuidv4 } = require('uuid');
const HOST_URL = 'http://host.docker.internal:8080/'

describe("Basic tests", () => {
    let driver;
    beforeEach(async () => {
        driver = await new Builder()
            .forBrowser('chrome')
            .usingServer('http://localhost:4444/wd/hub') // URL to Selenium Hub
            .setChromeOptions(new chrome.Options().headless().addArguments("--no-sandbox", "--disable-dev-shm-usage"))
            .build();
        await driver.get(HOST_URL);
        await driver.manage().window().setRect({ width: 1920, height: 1080 });
    }, 30000)

    afterEach(async () => {
        if (driver) {
            await driver.quit()
        }
    })
    it("should have a public sign in authentication interface", async () => {
        await navigateToLogin(driver)
        const path = new URL(await driver.getCurrentUrl()).pathname;
        expect(path).toBe('/auth/login');
        await driver.wait(until.elementLocated(By.id('sign-in-email-input')));
        const inputFieldEmail = await driver.findElement(By.id('sign-in-email-input'));
        expect(inputFieldEmail).toBeTruthy();
        const inputFieldPassword = await driver.findElement(By.id('sign-in-password-input'));
        expect(inputFieldPassword).toBeTruthy();
        const signInButton = await driver.findElement(By.id('sign-in-btn'));
        expect(signInButton).toBeTruthy();
        const signUpLink = await driver.findElement(By.id('sign-up-link'));
        expect(signUpLink).toBeTruthy();
    }, 30000)

    it("should have a public sign up authentication interface", async () => {
        await navigateToRegister(driver)
        const path = new URL(await driver.getCurrentUrl()).pathname;
        expect(path).toBe('/auth/register');
        await driver.wait(until.elementLocated(By.id('sign-up-email-input')));
        const inputFieldEmail = await driver.findElement(By.id('sign-up-email-input'));
        expect(inputFieldEmail).toBeTruthy();
        const inputFieldPassword = await driver.findElement(By.id('sign-up-password-input'));
        expect(inputFieldPassword).toBeTruthy();
        const inputFieldRePassword = await driver.findElement(By.id('sign-up-repassword-input'));
        expect(inputFieldRePassword).toBeTruthy();
        const signInButton = await driver.findElement(By.id('sign-up-btn'));
        expect(signInButton).toBeTruthy();
        const signUpLink = await driver.findElement(By.id('sign-in-link'));
        expect(signUpLink).toBeTruthy();
    }, 30000)

    it("should be able to register and retrieve a session using sign up interface", async () => {
        await navigateToRegister(driver)
        const email = `randomuser-${uuidv4()}@noreply.com`
        const password = 'changeme4321'
        console.log('Registering user (email): ', email)
        await driver.wait(until.elementLocated(By.id('sign-up-email-input')));
        await signUpFlow(driver, email, password);
        expect(new URL(await driver.getCurrentUrl()).pathname).toBe('/')
        // expect(until.elementLocated(By.id('header-session-user-id'))).toBe()
    }, 30000)
})

describe("Test entities autocreation", () => {
    const USER_IDENTIFIER = 'user@user.user'
    const USER_PASSWORD = 'user1234'
    let driver;

    beforeAll(() => {
        try {
            const output = execSync(`cd ${path.join(__dirname, '..', '..', '..')} && yarn add-user ${USER_IDENTIFIER} ${USER_PASSWORD} admin`, { encoding: 'utf-8', stdio: 'inherit' })
            expect(output.includes('Done')).toBeTruthy();
        } catch (e) { } // Prevent crash when user already exist
    }, 10000)

    beforeEach(async () => {
        driver = await new Builder()
            .forBrowser('chrome')
            .usingServer('http://localhost:4444/wd/hub') // URL to Selenium Hub
            .setChromeOptions(new chrome.Options().headless().addArguments("--no-sandbox", "--disable-dev-shm-usage"))
            .build();
        await driver.get(HOST_URL);
        await driver.manage().window().setRect({ width: 1920, height: 1080 });
        await navigateToLogin(driver);
        await signInSubmit(driver, USER_IDENTIFIER, USER_PASSWORD);
        await navigateToWorkspace(driver);
    }, 30000)

    afterEach(async () => {
        if (driver) {
            await driver.quit()
        }
    }, 10000)

    describe.skip("sample", () => {
        it('test sample', () => {
            expect(true).toBe(true)
        })
    })

    describe("test api creations", () => {
        const TEMPLATES = {
            Automatic_CRUD: 0,
            Automatic_CRUD_Custom_Storage: 1,
            IOT_Router: 2,
            Empty: 3
        }

        const OBJECTS = {
            Without_Object: 0
        }
 
        beforeEach(async () => {
            await getEditableObjectCreate(driver, 'apis')
        }, 30000)
        it("should be able to create an empty api", async () => {
            const apiName = 'testapi'
            await fillEditableObjectInput(driver, 'name', apiName)
            await fillEditableObjectSelect(driver, 'template', TEMPLATES.Empty)
            await fillEditableObjectSelect(driver, 'object', OBJECTS.Without_Object)
            await submitEditableObject(driver)
            await driver.wait(until.elementLocated(By.id(`apis-datatable-${apiName}`)))
            const dt_api_name = await driver.findElement(By.id(`apis-datatable-${apiName}`)).getText()
            expect(dt_api_name).toBe(apiName);
        }, 30000)
    })

    describe("test object creation", () => {
        beforeEach(async () => {
            await getEditableObjectCreate(driver, 'objects')
        }, 30000)

        it("should be able to create a simple object", async () => {
            const objectName = 'testObject'
            await fillEditableObjectInput(driver, 'name', objectName)
            // Open editable form
            await driver.executeScript('document.querySelector("#eo-formgroup>span>div>div>span>button").click()')
            await driver.executeScript('document.querySelector("#eo-obj-comp-btn").click()')
            // Fill object key
            const keyName = "myKey"
            const locator = By.xpath("//*[@id='eo-add-field-input']/span/input")
            await driver.wait(until.elementLocated(locator))
            const keyInput = await driver.findElement(locator)
            await keyInput.clear() // Clear previous values
            for (let character of keyName) { // Send keys slowly 
                await keyInput.sendKeys(character)
                await driver.sleep(10); // Adjust the sleep time as necessary
            }
            await driver.executeScript('document.querySelector("#alert-dlg-accept").click()')
            await submitEditableObject(driver)
            await driver.wait(until.elementLocated(By.id(`objects-datatable-${objectName}`)))
            const dt_object_name = await driver.findElement(By.id(`objects-datatable-${objectName}`)).getText()
            expect(dt_object_name).toBe(objectName);
        }, 30000)
    })

    describe("test page creation", () => {
        const PAGE_TEMPLATES = {
            BLANK: "blank",
            DEFAULT: "default",
            ADMIN: "admin",
            LANDING: "landing"
        }

        beforeEach(async () => {
            await getEditableObjectCreate(driver, 'pages')
        }, 30000)

        it("should be able to create a blank page", async () => {
            const pageName = 'testpage'
            const pageRoute = 'testpage'
            // Select template
            const pageTemplateElem = await driver.findElement(By.id(`pages-template-${PAGE_TEMPLATES.BLANK}`))
            await pageTemplateElem.click()
            const addPageButtonElem1 = await driver.findElement(By.id(`admin-pages-add-btn`))
            await addPageButtonElem1.click()
            // Configure page
            await fillEditableObjectInput(driver, 'name', pageName, 10)
            await fillEditableObjectInput(driver, 'route', pageRoute, 10)
            const addPageButtonElem2 = await driver.findElement(By.id(`admin-pages-add-btn`))
            await addPageButtonElem2.click()
            await driver.wait(until.elementLocated(By.id(`pages-datatable-${pageName}`)))
            const dt_page_name = await driver.findElement(By.id(`pages-datatable-${pageName}`)).getText()
            expect(dt_page_name).toBe(pageName);
        }, 30000)
    })
})

const navigateToLogin = async (driver) => {
    await driver.wait(until.elementLocated(By.id('header-login-link')));
    await driver.executeScript("document.querySelector('#header-login-link > p').click();");
    await driver.wait(until.elementLocated(By.id('sign-in-btn')));
}

const navigateToRegister = async (driver) => {
    await navigateToLogin(driver)
    await driver.wait(until.elementLocated(By.id('sign-up-link')));
    const signUpLinkElem = await driver.findElement(By.id('sign-up-link'))
    await signUpLinkElem.click()
    await driver.wait(until.elementLocated(By.id('sign-up-btn')));
}

const navigateToWorkspace = async (driver) => {
    await driver.wait(until.elementLocated(By.id('header-session-user-id')));
    await driver.executeScript("document.querySelector('#layout-menu-btn').click();");
    await driver.wait(until.elementLocated(By.id("pop-over-workspace-link")));
    await driver.executeScript("document.querySelector('#pop-over-workspace-link').click();");
    await driver.wait(async () => {
        const currentUrl = await driver.getCurrentUrl();
        return currentUrl.includes('/admin');
    });
}

async function signInSubmit(driver, email, password) {
    // Fill sign-in form
    const inputFieldEmail = await driver.findElement(By.id('sign-in-email-input'));
    await inputFieldEmail.sendKeys(email);
    const inputFieldPassword = await driver.findElement(By.id('sign-in-password-input'));
    await inputFieldPassword.sendKeys(password);
    const signInButton = await driver.findElement(By.id('sign-in-btn'));
    await signInButton.click()
}

async function signUpFlow(driver, email, password) {
    // Fill sign-up form
    const inputFieldEmail = await driver.findElement(By.id('sign-up-email-input'));
    await inputFieldEmail.sendKeys(email);
    const inputFieldPassword = await driver.findElement(By.id('sign-up-password-input'));
    await inputFieldPassword.sendKeys(password);
    const inputFieldRePassword = await driver.findElement(By.id('sign-up-repassword-input'));
    await inputFieldRePassword.sendKeys(password);
    const signUpButton = await driver.findElement(By.id('sign-up-btn'));
    await signUpButton.click()
    await driver.wait(async () => { // Wait to load session and be redirected to '/'
        return (
            (new URL(await driver.getCurrentUrl()).pathname === '/')
            && until.elementLocated(By.id('header-session-user-id'))
            && until.elementIsVisible(By.id('home-page'))
        )
    });
}

const getEditableObjectCreate = async (driver, entity) => {
    /*open create dialog */
    await driver.get(HOST_URL + `admin/${entity}`);
    await driver.wait(until.elementLocated(By.id('admin-dataview-add-btn')));
    await driver.executeScript("document.querySelector('#admin-dataview-add-btn').click();");
    await driver.wait(until.elementLocated(By.id('admin-dataview-create-dlg')))
    await driver.wait(until.elementLocated(By.id('admin-eo')))
}

const fillEditableObjectInput = async (driver, field, value, debounce = undefined) => {
    /*fill input */
    const nameInput = await driver.findElement(By.id(`editable-object-input-${field}`))
    await nameInput.clear() // Clear previous values
    const sendSlowly = debounce ?? false
    if (sendSlowly) {
        for (let character of value) { // Send keys slowly 
            await nameInput.sendKeys(character);
            await driver.sleep(debounce ?? 10); // Adjust the sleep time as necessary
        }
    } else {
        await nameInput.sendKeys(value);
    }
}

const fillEditableObjectSelect = async (driver, field, option) => {
    /*open selectable */
    // await driver.executeScript(`document.querySelector("#eo-select-list-${field}").parentElement.querySelector("span>li").click()`);
    const selectListElem = await driver.findElement(By.xpath(`//*[@id='eo-select-list-${field}']/../span/li`))
    await selectListElem.click()
    /*click selectable option */
    const selectListOptionElem = await driver.findElement(By.xpath(`//*[@id='eo-select-list-${field}-item-${option}']/..`))
    await selectListOptionElem.click();
    // await driver.executeScript(`document.querySelector("#eo-select-list-${field}-item-${option}").parentElement.click()`)
}

const submitEditableObject = async (driver) => {
    await driver.executeScript(`document.querySelector("#admin-eo>div>div>div>span>span>span>button").click()`)
}

const takeScreenshot = async (driver, name) => {
    const img = await driver.takeScreenshot(driver);
    fs.writeFileSync(__dirname + `/${name}.png`, img, 'base64')
}
