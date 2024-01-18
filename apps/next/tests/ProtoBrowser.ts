import * as path from 'path';
import * as fs from 'fs';

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

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
        if (this.driver) {
            await this.driver.quit()
        }
    }

    getDriver() {
        return this.driver;
    }

    async clickElement(selector: any): Promise<any> {
        // wait element to exist --> find it using selector --> click it
        const elementFound = await this.waitForElement(selector)
        await elementFound.click();
        return elementFound; // Returns clicked element
    }

    async getElementText(selector: any): Promise<any> {
        return await (await this.waitForElement(selector)).getText()
    }

    async getUrlPath(): Promise<string> {
        return new URL(await this.getDriver().getCurrentUrl()).pathname;
    }

    async waitForElement(selector: any): Promise<any> {
        await this.driver.wait(until.elementLocated(selector));
        const elementFound = await this.driver.findElement(selector);
        return elementFound
    }

    async navigateToLogin() {
        await this.waitForElement(By.id('header-login-link'));
        await this.driver.executeScript("document.querySelector('#header-login-link > p').click();");
        await this.waitForElement(By.id('sign-in-btn'));
    }

    async navigateToRegister() {
        await this.navigateToLogin()
        await this.clickElement(By.id('sign-up-link'))
        await this.waitForElement(By.id('sign-up-btn'))
    }

    async navigateToWorkspace() {
        await this.waitForElement(By.id('header-session-user-id'));
        await this.driver.executeScript("document.querySelector('#layout-menu-btn').click();");
        await this.driver.executeScript("document.querySelector('#pop-over-workspace-link').click();");
        await this.getDriver().wait(async () => (await this.getUrlPath()).includes('/admin'));
    }

    async signInSubmit(email: string, password: string) {
        // Fill sign-in form
        const inputFieldEmail = await this.waitForElement(By.id('sign-in-email-input'));
        await inputFieldEmail.sendKeys(email);
        const inputFieldPassword = await this.waitForElement(By.id('sign-in-password-input'));
        await inputFieldPassword.sendKeys(password);
        await this.clickElement(By.id('sign-in-btn'));
    }

    async signUpFlow(email: string, password: string) {
        // Fill sign-up form
        const inputFieldEmail = await this.waitForElement(By.id('sign-up-email-input'));
        await inputFieldEmail.sendKeys(email);
        const inputFieldPassword = await this.waitForElement(By.id('sign-up-password-input'));
        await inputFieldPassword.sendKeys(password);
        const inputFieldRePassword = await this.waitForElement(By.id('sign-up-repassword-input'));
        await inputFieldRePassword.sendKeys(password);
        await this.clickElement(By.id('sign-up-btn'))
        await this.driver.wait(async () => { // Wait to load session and be redirected to '/'
            return (
                await this.getUrlPath() === '/'
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
        await this.clickElement(By.id('admin-dataview-add-btn'));
        await this.waitForElement(By.id('admin-dataview-create-dlg'));
        await this.waitForElement(By.id('admin-eo'));
    }

    async fillEditableObjectInput(field: string, value: string, debounce?: number) {
        /*fill input */
        const nameInput = await this.waitForElement(By.id(`editable-object-input-${field}`))
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
        await this.clickElement(By.xpath(`//*[@id='eo-select-list-${field}']/../span/li`)) // open selectable
        await this.clickElement(By.xpath(`//*[@id='eo-select-list-${field}-item-${option}']/..`))// click selectable option
    }

    async submitEditableObject() {
        await this.clickElement(By.xpath("//*[@id='admin-eo']/div/div/div/span/span/span/button"))
    }

    async takeScreenshot(filename: string) {
        fs.writeFileSync(path.join(__dirname, `${filename}.png`), await this.getDriver().takeScreenshot(), 'base64')
    }

}