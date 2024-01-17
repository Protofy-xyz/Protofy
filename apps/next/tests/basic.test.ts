const { execSync } = require('child_process');
const path = require('path')
const { By, until } = require('selenium-webdriver');
const { v4: uuidv4 } = require('uuid');
import { ProtoBrowser } from './ProtoBrowser'

describe("Basic tests", () => {
    let protoBrowser: any;
    beforeEach(async () => {
        protoBrowser = await ProtoBrowser.__newInstance__()
    }, 30000)

    afterEach(async () => {
        await protoBrowser.close()
    })
    it("should have a public sign in authentication interface", async () => {
        await protoBrowser.navigateToLogin()
        let driver = protoBrowser.getDriver()
        const path = new URL(await driver.getCurrentUrl()).pathname; // TODO: create a method that returns current URL
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
        await protoBrowser.navigateToRegister()
        let driver = protoBrowser.getDriver()
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
        await protoBrowser.navigateToRegister()
        let driver = protoBrowser.getDriver()
        const email = `randomuser-${uuidv4()}@noreply.com`
        const password = 'changeme4321'
        // console.log('Registering user (email): ', email)
        await driver.wait(until.elementLocated(By.id('sign-up-email-input')));
        await protoBrowser.signUpFlow(email, password);
        expect(new URL(await driver.getCurrentUrl()).pathname).toBe('/')
        // expect(until.elementLocated(By.id('header-session-user-id'))).toBe()
    }, 30000)
})

describe("Test entities autocreation", () => {
    const USER_IDENTIFIER = 'user@user.user'
    const USER_PASSWORD = 'user1234'
    let protoBrowser: any;

    beforeAll(async () => { // Create a user with admin role
        try {
            const output = execSync(`cd ${path.join(__dirname, '..', '..', '..')} && yarn add-user ${USER_IDENTIFIER} ${USER_PASSWORD} admin`, { encoding: 'utf-8', stdio: 'inherit' })
            expect(output.includes('Done')).toBeTruthy();
        } catch (e) { } // Prevent crash when user already exist
        // Login and navigate to workspace
        protoBrowser = await ProtoBrowser.__newInstance__()
        await protoBrowser.navigateToLogin();
        await protoBrowser.signInSubmit(USER_IDENTIFIER, USER_PASSWORD);
        await protoBrowser.navigateToWorkspace();
    }, 60000)

    afterAll(async () => {
        await protoBrowser.close()
    }, 20000)

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
        it("should be able to create an empty api", async () => {
            await protoBrowser.navigateToWorkspaceSection('apis')
            await protoBrowser.getEditableObjectCreate()
            const apiName = 'testapi'
            await protoBrowser.fillEditableObjectInput('name', apiName)
            await protoBrowser.fillEditableObjectSelect('template', TEMPLATES.Empty)
            await protoBrowser.fillEditableObjectSelect('object', OBJECTS.Without_Object)
            await protoBrowser.submitEditableObject()
            let driver = await protoBrowser.getDriver()
            await driver.wait(until.elementLocated(By.id(`apis-datatable-${apiName}`)))
            const dt_api_name = await driver.findElement(By.id(`apis-datatable-${apiName}`)).getText()
            expect(dt_api_name).toBe(apiName);
        }, 30000)
    })

    describe("test object creation", () => {
        beforeEach(async () => {
            await protoBrowser.navigateToWorkspaceSection('objects')
            await protoBrowser.getEditableObjectCreate()
        }, 30000)

        it("should be able to create a simple object", async () => {
            const objectName = 'testObject'
            await protoBrowser.fillEditableObjectInput('name', objectName)
            // Open editable form
            let driver = protoBrowser.getDriver();
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
            await protoBrowser.submitEditableObject()
            await driver.wait(until.elementLocated(By.id(`objects-datatable-${objectName}`)))
            const dt_object_name = await driver.findElement(By.id(`objects-datatable-${objectName}`)).getText()
            expect(dt_object_name).toBe(objectName);
        }, 30000)
    })

    describe("test page entity", () => {
        const PAGE_TEMPLATES = {
            BLANK: "blank",
            DEFAULT: "default",
            ADMIN: "admin",
            LANDING: "landing",
            ECOMERCE: "ecomerce",
            NEWSFEED: "newsfeed",
        }

        describe("test page creation", () => {
            beforeEach(async () => {
                await protoBrowser.navigateToWorkspaceSection('pages')
                await protoBrowser.getEditableObjectCreate()
            }, 30000)
            it("should be able to create a blank page", async () => {
                const pageName = 'testpage'
                const pageRoute = 'testpage'
                // Select template
                let driver = protoBrowser.getDriver()
                await protoBrowser.clickElement(By.id(`pages-template-${PAGE_TEMPLATES.BLANK}`))
                await protoBrowser.clickElement(By.id(`admin-pages-add-btn`))
                // Configure page
                await protoBrowser.fillEditableObjectInput('name', pageName, 10)
                await protoBrowser.fillEditableObjectInput('route', pageRoute, 10)
                await protoBrowser.clickElement(By.id(`admin-pages-add-btn`))
                await driver.wait(until.elementLocated(By.id(`pages-datatable-${pageName}`)))
                const dt_page_name = await driver.findElement(By.id(`pages-datatable-${pageName}`)).getText()
                expect(dt_page_name).toBe(pageName);
            }, 30000)
        })

        describe("test edit page", () => {
            beforeEach(async () => {
                await protoBrowser.navigateToWorkspaceSection('pages')
            }, 30000)
            it("should be able to edit the page", async () => {
                let driver = protoBrowser.getDriver()
                await driver.wait(until.elementLocated(By.id('admin-dataview-add-btn')));
                await protoBrowser.clickElement(By.id("more-btn-home"))
                await protoBrowser.clickElement(By.id("more-btn-home-option-1"))
                await driver.wait(until.elementLocated(By.id('file-widget-home')));
            }, 10000)
        })

    })
})