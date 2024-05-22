const YandexMarketPage = require("../pages/market");
const mocha = require("mocha");
const {By, logging} = require("selenium-webdriver");
const {assert} = require("chai")
const {allure} = require("allure-mocha/runtime");

const withErrorHandling = (fn, handler) => {
    return async () => {
        try {
            await fn();
        } catch (error) {
            console.error(error);
            handler();
        }
    };
};

mocha.describe("YandexMarket", function () {
    this.timeout(10000000);
    const yandexMarketPage = new YandexMarketPage();
    let firstElem;

    before(async () => {
        await yandexMarketPage.open();
    });

    after(async () => {
        await yandexMarketPage.closeBrowser();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            const dateTime = new Date().toLocaleDateString();
            await yandexMarketPage.saveScreenshot(dateTime);
        }
    });

    it(
        "Favorites", async () => {
            await allure.step('Open xbox page', withErrorHandling(
                async () => {
                    allure.step('Opens xbox page', async () => {
                        await yandexMarketPage.clickCatalogButton();
                        await yandexMarketPage.hoverCategory();
                        await yandexMarketPage.clickXbox();
                    })
                },
                async () => await yandexMarketPage.saveScreenshot("error.png"),
            ))

            await allure.step(
                "Log titles and prices from xbox page",
                withErrorHandling(
                    async () => {
                        firstElem = await yandexMarketPage.logElements();
                    },
                    async () => await yandexMarketPage.saveScreenshot("error.png"),
                ),
            );

            await allure.step(
                "Add to favorites",
                withErrorHandling(
                    async () => {
                        await yandexMarketPage.addFavorites();
                    },
                    async () => await yandexMarketPage.saveScreenshot("error.png"),
                ),
            );

            await allure.step(
                "Open favorites",
                withErrorHandling(
                    async () => {
                        await yandexMarketPage.openFavorites();
                    },
                    async () => await yandexMarketPage.saveScreenshot("error.png"),
                ),
            );

            await allure.step(
                "Remove favorites",
                withErrorHandling(
                    async () => {
                        await yandexMarketPage.click(By.xpath(yandexMarketPage.xpathRemoveFavorites));
                    },
                    async () => await yandexMarketPage.saveScreenshot("error.png"),
                ),
            );

            await allure.step(
                "Check favorite",
                withErrorHandling(
                    async () => {
                        console.log()
                        // const [title, price] = await yandexMarketPage.getFavorites();
                        const favorites = await yandexMarketPage.getFavorites();
                        console.log(favorites)
                        assert.equal(favorites[0], firstElem[0]);
                        assert.equal(favorites[0], firstElem[1]);
                    },
                    async () => await yandexMarketPage.saveScreenshot("error.png"),
                ),
            );

            await allure.step(
                "Refresh page",
                withErrorHandling(
                    async () => {
                        assert.equal(await yandexMarketPage.getSaveText(), "Сохраняйте здесь товары");
                        await yandexMarketPage.refreshPage();
                    },
                    async () => await yandexMarketPage.saveScreenshot("error.png"),
                ),
            );
        }
    );
});
