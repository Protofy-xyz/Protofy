import { ProtoBrowser } from '../ProtoBrowser'
const { execSync } = require('child_process');
const path = require('path')
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
    })
    afterEach(async () => {
        await protoBrowser.close()
    })
    it("should have a public sign in authentication interface", async () => {
        await protoBrowser.navigateToLogin()
        expect(await protoBrowser.getUrlPath()).toBe('/auth/login');
        expect(await protoBrowser.waitForElement('#sign-in-email-input')).toBeTruthy();
        expect(await protoBrowser.waitForElement('#sign-in-password-input')).toBeTruthy();
        expect(await protoBrowser.waitForElement('#sign-in-btn')).toBeTruthy();
        expect(await protoBrowser.waitForElement('#sign-up-link')).toBeTruthy();
    })
    it("should have a public sign up authentication interface", async () => {
        await protoBrowser.navigateToRegister()
        expect(await protoBrowser.getUrlPath()).toBe('/auth/register');
        expect(await protoBrowser.waitForElement('#sign-up-email-input')).toBeTruthy();
        expect(await protoBrowser.waitForElement('#sign-up-password-input')).toBeTruthy();
        expect(await protoBrowser.waitForElement('#sign-up-repassword-input')).toBeTruthy();
        expect(await protoBrowser.waitForElement('#sign-up-btn')).toBeTruthy();
        expect(await protoBrowser.waitForElement('#sign-in-link')).toBeTruthy();
    })
    it("should be able to register and retrieve a session using sign up interface", async () => {
        await protoBrowser.navigateToRegister()
        await protoBrowser.waitForElement('#sign-up-email-input');
        await protoBrowser.signUpFlow(`randomuser-${uuidv4()}@noreply.com`, 'changeme4321');
        expect(await protoBrowser.getUrlPath()).toBe('/')
    })
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
    })

    describe("test api creations", () => {
        it("should be able to create an empty api", async () => {
            const apiName = 'testapi'
            await protoBrowser.navigateToWorkspaceSection('apis')
            await protoBrowser.getEditableObjectCreate()
            await protoBrowser.fillEditableObjectInput('name', apiName)
            await protoBrowser.fillEditableObjectSelect('template', API_TEMPLATES.Empty)
            await protoBrowser.fillEditableObjectSelect('object', API_OBJECT_OPTIONS.Without_Object)
            await protoBrowser.submitEditableObject()
            await protoBrowser.waitForElement(`#apis-datatable-${apiName}`)
            expect(await protoBrowser.getElementText(`#apis-datatable-${apiName}`)).toBe(apiName);
        }, 60000)
    })

    describe("test object creation", () => {
        beforeEach(async () => {
            await protoBrowser.navigateToWorkspaceSection('objects')
            await protoBrowser.getEditableObjectCreate()
        }, 60000)

        it("should be able to create a simple object", async () => {
            const objectName = 'testObject'
            await protoBrowser.fillEditableObjectInput('name', objectName)
            // Open editable form
            await protoBrowser.clickElement("xpath=//*[@id='eo-formgroup']/span/div/div/span/button")
            await protoBrowser.clickElement("#eo-obj-comp-btn")
            // Fill object key
            const keyName = "myKey"
            await protoBrowser.waitForElement("xpath=//*[@id='eo-add-field-input']/span/input");
            await protoBrowser.getPage().fill("xpath=//*[@id='eo-add-field-input']/span/input", keyName);
            await protoBrowser.clickElement("#alert-dlg-accept")
            await protoBrowser.submitEditableObject()
            await protoBrowser.waitForElement(`#objects-datatable-${objectName}`)
            expect(await protoBrowser.getElementText(`#objects-datatable-${objectName}`)).toBe(objectName);
        }, 60000)
    })

    describe("test page entity", () => {
        describe("test page creation", () => {
            beforeEach(async () => {
                await protoBrowser.navigateToWorkspaceSection('pages')
                await protoBrowser.getEditableObjectCreate()
            }, 60000)
            it("should be able to create a blank page", async () => {
                const pageName = 'testpage'
                const pageRoute = 'testpage'
                // Select template
                await protoBrowser.clickElement(`#pages-template-${PAGE_TEMPLATES.BLANK}`)
                await protoBrowser.clickElement(`#admin-pages-add-btn`)
                // Configure page
                await protoBrowser.fillEditableObjectInput('name', pageName)
                await protoBrowser.fillEditableObjectInput('route', pageRoute)
                await protoBrowser.clickElement(`#admin-pages-add-btn`)
                expect(await protoBrowser.getElementText(`#pages-datatable-${pageName}`)).toBe(pageName);
            }, 60000)
        })

        describe("test edit page", () => {
            beforeEach(async () => {
                await protoBrowser.navigateToWorkspaceSection('pages')
            }, 60000)
            it("should be able to edit the page", async () => {
                await protoBrowser.waitForElement('#admin-dataview-add-btn');
                await protoBrowser.clickElement("#more-btn-home")
                await protoBrowser.clickElement("#more-btn-home-option-1")
                expect(await protoBrowser.waitForElement('#file-widget-home')).toBeTruthy();
            }, 60000)
        })

    })
})