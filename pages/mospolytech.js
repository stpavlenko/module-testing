const BasePage = require('./basepage');
const {By, Key} = require("selenium-webdriver");

const URL = "https://mospolytech.ru/";

class MospolytechPage extends BasePage {
    constructor() {
        super();
        this.scheduleButtonXpath = '//*[@title="Расписание"]';
        this.searchInputXpath = '//div[@class="header-search search"]/input[@class="groups"]';
    }

    async openMospolytech() {
        await this.goToUrl(URL);
    }

    async navigateToSchedule() {
        await this.click(By.xpath(this.scheduleButtonXpath));
        await this.click(By.xpath('//a[span[text()="Смотрите на сайте"]]'));
        await this.switchToNextWindow();
    }

    async searchAndSelectGroup(groupNumber) {
        await this.enterText(By.xpath(this.searchInputXpath), groupNumber + Key.RETURN);
        await driver.sleep(1000);
        const selectXpath = `//div[@class="found-groups row not-print"]//div[contains(text(), '${groupNumber}')]`;
        await this.click(By.xpath(selectXpath));
        await driver.sleep(5000);
    }

    async isCurrentDayHighlighted() {
        const days = await driver.findElements(By.xpath('//div[@class="schedule-week"]/child::div'));
        const todayIndex = new Date().getDay() - 1;
        const todayClass = await days[todayIndex]?.getAttribute("class");
        return todayClass.includes("schedule-day_today");
    }

    async switchToNextWindow() {
        const handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[1]);
    }

    async takeScreenshot(filename) {
        await driver.takeScreenshot().then(
            function (image, err) {
                require('fs').writeFileSync(filename, image, 'base64');
            }
        );
    }
}

module.exports = MospolytechPage;
