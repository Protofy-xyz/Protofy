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
    }, 30000)

    afterEach(async () => {
        await protoBrowser.close()
    })
    it("should have a public sign in authentication interface", async () => {
        await protoBrowser.navigateToLogin()
        const path = await protoBrowser.getUrlPath();
        expect(path).toBe('/auth/login');
        await protoBrowser.waitForElement(By.id('sign-in-email-input'));
        const inputFieldEmail = await protoBrowser.waitForElement(By.id('sign-in-email-input'));
        expect(inputFieldEmail).toBeTruthy();
        const inputFieldPassword = await protoBrowser.waitForElement(By.id('sign-in-password-input'));
        expect(inputFieldPassword).toBeTruthy();
        const signInButton = await protoBrowser.waitForElement(By.id('sign-in-btn'));
        expect(signInButton).toBeTruthy();
        const signUpLink = await protoBrowser.waitForElement(By.id('sign-up-link'));
        expect(signUpLink).toBeTruthy();
    }, 30000)

    it("should have a public sign up authentication interface", async () => {
        await protoBrowser.navigateToRegister()
        const path = await protoBrowser.getUrlPath();
        expect(path).toBe('/auth/register');
        await protoBrowser.waitForElement(By.id('sign-up-email-input'));
        const inputFieldEmail = await protoBrowser.waitForElement(By.id('sign-up-email-input'));
        expect(inputFieldEmail).toBeTruthy();
        const inputFieldPassword = await protoBrowser.waitForElement(By.id('sign-up-password-input'));
        expect(inputFieldPassword).toBeTruthy();
        const inputFieldRePassword = await protoBrowser.waitForElement(By.id('sign-up-repassword-input'));
        expect(inputFieldRePassword).toBeTruthy();
        const signInButton = await protoBrowser.waitForElement(By.id('sign-up-btn'));
        expect(signInButton).toBeTruthy();
        const signUpLink = await protoBrowser.waitForElement(By.id('sign-in-link'));
        expect(signUpLink).toBeTruthy();
    }, 30000)

    it("should be able to register and retrieve a session using sign up interface", async () => {
        await protoBrowser.navigateToRegister()
        const email = `randomuser-${uuidv4()}@noreply.com`
        const password = 'changeme4321'
        await protoBrowser.waitForElement(By.id('sign-up-email-input'));
        await protoBrowser.signUpFlow(email, password);
        expect(await protoBrowser.getUrlPath()).toBe('/')
    }, 30000)
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
            await protoBrowser.navigateToWorkspaceSection('apis')
            await protoBrowser.getEditableObjectCreate()
            const apiName = 'testapi'
            await protoBrowser.fillEditableObjectInput('name', apiName)
            await protoBrowser.fillEditableObjectSelect('template', API_TEMPLATES.Empty)
            await protoBrowser.fillEditableObjectSelect('object', API_OBJECT_OPTIONS.Without_Object)
            await protoBrowser.submitEditableObject()
            await protoBrowser.waitForElement(By.id(`apis-datatable-${apiName}`))
            const dt_api_name = await protoBrowser.getElementText(By.id(`apis-datatable-${apiName}`))
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
            const dt_object_name = await protoBrowser.getElementText(By.id(`objects-datatable-${objectName}`))
            expect(dt_object_name).toBe(objectName);
        }, 30000)
    })

    describe("test page entity", () => {
        describe("test page creation", () => {
            beforeEach(async () => {
                await protoBrowser.navigateToWorkspaceSection('pages')
                await protoBrowser.getEditableObjectCreate()
            }, 30000)
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
                const dt_page_name = await protoBrowser.getElementText(By.id(`pages-datatable-${pageName}`))
                expect(dt_page_name).toBe(pageName);
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
                await protoBrowser.waitForElement(By.id('file-widget-home'));
            }, 10000)
        })

    })
})