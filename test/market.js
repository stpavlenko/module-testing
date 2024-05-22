const YandexMarketPage = require("../pages/market");
const mocha = require("mocha");
const {By} = require("selenium-webdriver");
const {assert} = require("chai")

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
        "Opens xbox page",
        withErrorHandling(
            async () => {
                await yandexMarketPage.clickCatalogButton();
                await yandexMarketPage.hoverCategory();
                await yandexMarketPage.clickXbox();
            },
            async () => await yandexMarketPage.saveScreenshot("error.png"),
        ),
    );

    it(
        "Log titles and prices from xbox page",
        withErrorHandling(
            async () => {
                firstElem = await yandexMarketPage.logElements();
            },
            async () => await yandexMarketPage.saveScreenshot("error.png"),
        ),
    );

    it(
        "Add to favorites",
        withErrorHandling(
            async () => {
                await yandexMarketPage.addFavorites();
            },
            async () => await yandexMarketPage.saveScreenshot("error.png"),
        ),
    );

    it(
        "Open favorites",
        withErrorHandling(
            async () => {
                await yandexMarketPage.openFavorites();
            },
            async () => await yandexMarketPage.saveScreenshot("error.png"),
        ),
    );

    it(
        "Remove favorites",
        withErrorHandling(
            async () => {
                await yandexMarketPage.click(By.xpath(yandexMarketPage.xpathRemoveFavorites));
            },
            async () => await yandexMarketPage.saveScreenshot("error.png"),
        ),
    );

    it(
        "Check favorite",
        withErrorHandling(
            async () => {
                const [title, price] = await yandexMarketPage.getFavorites();
                assert.equal(title, firstElem[0]);
                assert.equal(title, firstElem[1]);
            },
            async () => await yandexMarketPage.saveScreenshot("error.png"),
        ),
    );

    it(
        "Refresh page",
        withErrorHandling(
            async () => {
                assert.equal(await yandexMarketPage.getSaveText(), "Сохраняйте здесь товары");
                await yandexMarketPage.refreshPage();
            },
            async () => await yandexMarketPage.saveScreenshot("error.png"),
        ),
    );
});
