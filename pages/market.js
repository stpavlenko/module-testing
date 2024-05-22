const BasePage = require("../pages/basepage");
const {By, until} = require("selenium-webdriver");
const {allure} = require("allure-mocha/runtime");

const URL = "https://market.yandex.ru/";

class MarketPage extends BasePage {
    constructor() {
        super();
        this.URL = URL;
        this.xpathCatalog = "//button[@class='_30-fz button-focus-ring Hkr1q _1pHod _2rdh3 _3rbM-']";
        this.xpathCategory = "//li//a[@href='/catalog--geiming/41813350']";
        this.xpathXbox =
            "//a[@href='/catalog--igrovye-pristavki-xbox/41813471/list?hid=91122&glfilter=12782797%3A17888497%2C15163455%2C15163454%2C15163453%2C15163452%2C16092905']";
        this.xpathTitles = "//h3[@class='G_TNq _2SUA6 _33utW _13aK2 h29Q2 _1A5yJ']";
        this.xpathPrices = "//span[@class='_1ArMm']";
        this.xpathAddFavorites = "//button[@title='Добавить в избранное']";
        this.xpathRemoveFavorites = "//button[@title='Удалить из избранного']";
        this.xpathFavoritesList = "//a[@href='/my/wishlist?track=head']";
        this.xpathSave = "//div[@class='_3wd6p _1ehmv']";
    }

    async getTextFromMultipleElements(locator) {
        allure.step('Get text from multiple elements', async () => {
            const elements = await driver.findElements(locator);
            const texts = [];
            for (const element of elements) {
                texts.push(await element.getText());
            }
            return texts;
        })

    }

    async getTextFromElement(locator) {
        allure.step('Get text from element', async () => {
            await driver.wait(until.elementIsVisible(driver.findElement(locator)), 10000);
            return driver.findElement(locator).getText();
        })
    }

    async open() {
        allure.step('Open page', async () => {
            await this.goToUrl("https://market.yandex.ru/");
            await driver.manage().addCookie({
                name: "spravka",
                value:
                    "dD0xNzE0OTI1MDg0O2k9MjEyLjQ2LjEwLjg4O0Q9QkIxMjBCMjA1OUNBMjgxREFCNjRBN0EwNzRBQTRBMTY4RDczQTBCNjQ5QjE5Q0ZFQjgxNUU2RkREM0FBODkzODlFRjAyNUQ4NUZFMEU1RUU5Rjc4RkRDNDI4OTc0ODM5OTY4QUMwREFENzY5QTE5MTNEOURBMkE5RDdFOUU2QTQ2NERDMzREOTFFNTkwOEMwRjc2NTU4NTBEM0VFODA4RTdERThDRTlGNDI5ODQ1RjJBOTBGM0ZBM0I2O3U9MTcxNDkyNTA4NDQzNjA0MTY5MDtoPTg1NzQxN2M1ZjAxZDJkMTc5ZWU1ZDgzMzMyY2I5NGQ3",
            });
            await this.goToUrl("https://market.yandex.ru/");
            driver.manage().window().maximize();
        })
    }

    async clickCatalogButton() {
        allure.step('Click catalog button', async () => {
            await this.click(By.xpath(this.xpathCatalog));
        })
    }

    async hoverCategory() {
        allure.step('Hover category', async () => {
            await driver
                .actions()
                .move({origin: await driver.findElement(By.xpath(this.xpathCategory))})
                .perform();
            driver.sleep(2000);
        })
    }

    async clickXbox() {
        allure.step('Click Xbox', async () => {
            await this.click(By.xpath(this.xpathXbox));
        })
    }

    async logElements() {
        allure.step('Log elements', async () => {
            const xboxTitles = await driver.findElements(By.xpath(this.xpathTitles));
            const xboxPrices = await driver.findElements(By.xpath(this.xpathPrices));
            const elements = await Promise.all(
                xboxTitles.slice(0, 5).map(async (el, i) => [await el.getText(), await xboxPrices[i].getText()]),
            );
            for (let [title, price] of elements) {
                console.log(title, price);
            }
            return elements;
        })
    }

    async addFavorites() {
        allure.step('Add favorites', async () => {
            await this.click(By.xpath(this.xpathAddFavorites));
        })
    }

    async openFavorites() {
        allure.step('Open favorites', async () => {
            await this.click(By.xpath(this.xpathFavoritesList));
        })
    }

    async getFavorites() {
        allure.step('Get favorites', async () => {
            const titles = await this.getTextFromMultipleElements(By.xpath(this.xpathTitles));
            const prices = await this.getTextFromMultipleElements(By.xpath(this.xpathPrices));
            return [titles, prices];
        })
    }

    async refreshPage() {
        allure.step('Refresh page', async () => {
            await driver.navigate().refresh();
        })
    }

    async getSaveText() {
        allure.step('Get save text', async () => {
            const elem = await driver.findElement(By.xpath(xpathSave));
            return await elem.getText()
        })

    }
}

module.exports = MarketPage;
