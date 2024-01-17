import * as path from 'path';
import * as fs from 'fs';

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { v4: uuidv4 } = require('uuid');

const HOST_URL = 'http://host.docker.internal:8080/'

export class ProtoBrowser {
    driver: any;
    constructor(driver: any) {
        this.driver = driver
    }

    static async __newInstance__(): Promise<ProtoBrowser> {
        let driver = await new Builder()
            .forBrowser('chrome')
            .usingServer('http://localhost:4444/wd/hub') // URL to Selenium Hub
            .setChromeOptions(new chrome.Options().headless().addArguments("--no-sandbox", "--disable-dev-shm-usage"))
            .build();
        await driver.get(HOST_URL);
        await driver.manage().window().setRect({ width: 1920, height: 1080 });
        return new ProtoBrowser(driver)
    }

    async close() {
        await this.driver.quit()
    }

    getDriver() {
        return this.driver;
    }

    async clickElement(id: string) {
        // wait element to exist --> find it --> click it
        await this.driver.wait(until.elementLocated(By.id(id)));
        const elementFound = await this.driver.findElement(By.id(id))
        await elementFound.click()
    }


    async navigateToLogin() {
        await this.driver.wait(until.elementLocated(By.id('header-login-link')));
        await this.driver.executeScript("document.querySelector('#header-login-link > p').click();");
        await this.driver.wait(until.elementLocated(By.id('sign-in-btn')));
    }

    async navigateToRegister() {
        await this.navigateToLogin()
        await this.clickElement('sign-up-link')
        await this.driver.wait(until.elementLocated(By.id('sign-up-btn')));
    }

    async navigateToWorkspace() {
        await this.driver.wait(until.elementLocated(By.id('header-session-user-id')));
        await this.driver.executeScript("document.querySelector('#layout-menu-btn').click();");
        await this.driver.wait(until.elementLocated(By.id("pop-over-workspace-link")));
        await this.driver.executeScript("document.querySelector('#pop-over-workspace-link').click();");
        await this.driver.wait(async () => {
            const currentUrl = await this.driver.getCurrentUrl();
            return currentUrl.includes('/admin');
        });
    }

    async signInSubmit(email: string, password: string) {
        // Fill sign-in form
        const inputFieldEmail = await this.driver.findElement(By.id('sign-in-email-input'));
        await inputFieldEmail.sendKeys(email);
        const inputFieldPassword = await this.driver.findElement(By.id('sign-in-password-input'));
        await inputFieldPassword.sendKeys(password);
        const signInButton = await this.driver.findElement(By.id('sign-in-btn'));
        await signInButton.click()
    }

    async signUpFlow(email: string, password: string) {
        // Fill sign-up form
        const inputFieldEmail = await this.driver.findElement(By.id('sign-up-email-input'));
        await inputFieldEmail.sendKeys(email);
        const inputFieldPassword = await this.driver.findElement(By.id('sign-up-password-input'));
        await inputFieldPassword.sendKeys(password);
        const inputFieldRePassword = await this.driver.findElement(By.id('sign-up-repassword-input'));
        await inputFieldRePassword.sendKeys(password);
        await this.clickElement('sign-up-btn')
        await this.driver.wait(async () => { // Wait to load session and be redirected to '/'
            return (
                (new URL(await this.driver.getCurrentUrl()).pathname === '/')
                && until.elementLocated(By.id('header-session-user-id'))
                && until.elementIsVisible(By.id('home-page'))
            )
        });
    }

    async navigateToWorkspaceSection(entity: string) {
        await this.driver.get(HOST_URL + `admin/${entity}`);
    }

    async getEditableObjectCreate() {
        /*open create dialog */
        await this.driver.wait(until.elementLocated(By.id('admin-dataview-add-btn')));
        await this.driver.executeScript("document.querySelector('#admin-dataview-add-btn').click();");
        await this.driver.wait(until.elementLocated(By.id('admin-dataview-create-dlg')))
        await this.driver.wait(until.elementLocated(By.id('admin-eo')))
    }

    async fillEditableObjectInput(field: string, value: string, debounce = undefined) {
        /*fill input */
        const nameInput = await this.driver.findElement(By.id(`editable-object-input-${field}`))
        await nameInput.clear() // Clear previous values
        const sendSlowly = debounce ?? false
        if (sendSlowly) {
            for (let character of value) { // Send keys slowly 
                await nameInput.sendKeys(character);
                await this.driver.sleep(debounce ?? 10); // Adjust the sleep time as necessary
            }
        } else {
            await nameInput.sendKeys(value);
        }
    }

    async fillEditableObjectSelect(field: string, option: string | number) {
        /*open selectable */
        const selectListElem = await this.driver.findElement(By.xpath(`//*[@id='eo-select-list-${field}']/../span/li`))
        await selectListElem.click()
        /*click selectable option */
        const selectListOptionElem = await this.driver.findElement(By.xpath(`//*[@id='eo-select-list-${field}-item-${option}']/..`))
        await selectListOptionElem.click();
    }

    async submitEditableObject() {
        await this.driver.executeScript(`document.querySelector("#admin-eo>div>div>div>span>span>span>button").click()`)
    }

    async takeScreenshot(name: string) {
        const img = await this.driver.takeScreenshot(this.driver);
        fs.writeFileSync(path.join(__dirname, `${name}.png`), img, 'base64')
    }

}