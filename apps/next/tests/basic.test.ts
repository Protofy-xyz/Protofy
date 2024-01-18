import { ProtoBrowser } from './ProtoBrowser'
const { execSync } = require('child_process');
const path = require('path')
const { By } = require('selenium-webdriver');
const { v4: uuidv4 } = require('uuid');
// Page menu opts
const PAGE_TEMPLATES = {
    BLANK: "blank",
    DEFAULT: "default",
    ADMIN: "admin",
    LANDING: "landing",
    ECOMERCE: "ecomerce",
    NEWSFEED: "newsfeed",
}
// Api menu opt
const API_TEMPLATES = {
    Automatic_CRUD: 0,
    Automatic_CRUD_Custom_Storage: 1,
    IOT_Router: 2,
    Empty: 3
}
// Api menu opt
const API_OBJECT_OPTIONS = {
    Without_Object: 0
}

describe("Basic tests", () => {
    let protoBrowser: ProtoBrowser;
    beforeEach(async () => {
        protoBrowser = await ProtoBrowser.__newInstance__()
    }, 10000)

    afterEach(async () => {
        await protoBrowser.close()
    }, 10000)
    it("should have a public sign in authentication interface", async () => {
        await protoBrowser.navigateToLogin()
        expect(await protoBrowser.getUrlPath()).toBe('/auth/login');
        expect(await protoBrowser.waitForElement(By.id('sign-in-email-input'))).toBeTruthy();
        expect(await protoBrowser.waitForElement(By.id('sign-in-password-input'))).toBeTruthy();
        expect(await protoBrowser.waitForElement(By.id('sign-in-btn'))).toBeTruthy();
        expect(await protoBrowser.waitForElement(By.id('sign-up-link'))).toBeTruthy();
    }, 10000)

    it("should have a public sign up authentication interface", async () => {
        await protoBrowser.navigateToRegister()
        expect(await protoBrowser.getUrlPath()).toBe('/auth/register');
        expect(await protoBrowser.waitForElement(By.id('sign-up-email-input'))).toBeTruthy();
        expect(await protoBrowser.waitForElement(By.id('sign-up-password-input'))).toBeTruthy();
        expect(await protoBrowser.waitForElement(By.id('sign-up-repassword-input'))).toBeTruthy();
        expect(await protoBrowser.waitForElement(By.id('sign-up-btn'))).toBeTruthy();
        expect(await protoBrowser.waitForElement(By.id('sign-in-link'))).toBeTruthy();
    }, 10000)

    it("should be able to register and retrieve a session using sign up interface", async () => {
        await protoBrowser.navigateToRegister()
        await protoBrowser.waitForElement(By.id('sign-up-email-input'));
        await protoBrowser.signUpFlow(`randomuser-${uuidv4()}@noreply.com`, 'changeme4321');
        expect(await protoBrowser.getUrlPath()).toBe('/')
    }, 10000)
})

describe("Test entities autocreation", () => {
    const USER_IDENTIFIER = 'user@user.user'
    const USER_PASSWORD = 'user1234'
    let protoBrowser: ProtoBrowser;

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
        it("should be able to create an empty api", async () => {
            const apiName = 'testapi'
            await protoBrowser.navigateToWorkspaceSection('apis')
            await protoBrowser.getEditableObjectCreate()
            await protoBrowser.fillEditableObjectInput('name', apiName)
            await protoBrowser.fillEditableObjectSelect('template', API_TEMPLATES.Empty)
            await protoBrowser.fillEditableObjectSelect('object', API_OBJECT_OPTIONS.Without_Object)
            await protoBrowser.submitEditableObject()
            await protoBrowser.waitForElement(By.id(`apis-datatable-${apiName}`))
            expect(await protoBrowser.getElementText(By.id(`apis-datatable-${apiName}`))).toBe(apiName);
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
            await protoBrowser.clickElement(By.xpath("//*[@id='eo-formgroup']/span/div/div/span/button"))
            await protoBrowser.clickElement(By.id("eo-obj-comp-btn"))
            // Fill object key
            const keyName = "myKey"
            const keyInput = await protoBrowser.waitForElement(By.xpath("//*[@id='eo-add-field-input']/span/input"))
            await keyInput.clear() // Clear previous values
            for (let character of keyName) { // Send keys slowly 
                await keyInput.sendKeys(character)
                await protoBrowser.getDriver().sleep(10); // Adjust the sleep time as necessary
            }
            await protoBrowser.clickElement(By.id("alert-dlg-accept"))
            await protoBrowser.submitEditableObject()
            await protoBrowser.waitForElement(By.id(`objects-datatable-${objectName}`))
            expect(await protoBrowser.getElementText(By.id(`objects-datatable-${objectName}`))).toBe(objectName);
        }, 30000)
    })

    describe("test page entity", () => {
        describe("test page creation", () => {
            beforeEach(async () => {
                await protoBrowser.navigateToWorkspaceSection('pages')
                await protoBrowser.getEditableObjectCreate()
            }, 40000)
            it("should be able to create a blank page", async () => {
                const pageName = 'testpage'
                const pageRoute = 'testpage'
                // Select template
                await protoBrowser.clickElement(By.id(`pages-template-${PAGE_TEMPLATES.BLANK}`))
                await protoBrowser.clickElement(By.id(`admin-pages-add-btn`))
                // Configure page
                await protoBrowser.fillEditableObjectInput('name', pageName, 10)
                await protoBrowser.fillEditableObjectInput('route', pageRoute, 10)
                await protoBrowser.clickElement(By.id(`admin-pages-add-btn`))
                expect(await protoBrowser.getElementText(By.id(`pages-datatable-${pageName}`))).toBe(pageName);
            }, 30000)
        })

        describe("test edit page", () => {
            beforeEach(async () => {
                await protoBrowser.navigateToWorkspaceSection('pages')
            }, 30000)
            it("should be able to edit the page", async () => {
                await protoBrowser.waitForElement(By.id('admin-dataview-add-btn'));
                await protoBrowser.clickElement(By.id("more-btn-home"))
                await protoBrowser.clickElement(By.id("more-btn-home-option-1"))
                expect(await protoBrowser.waitForElement(By.id('file-widget-home'))).toBeTruthy();
            }, 10000)
        })

    })
})