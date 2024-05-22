const YandexMarketPage = require("../pages/market");
const mocha = require("mocha");
const {By} = require("selenium-webdriver");

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
                if (title[0] !== firstElem[0][0] || price[0] !== firstElem[0][1]) {
                    throw new Error(
                        `Expected title: ${firstElem[0][0]}, price: ${firstElem[0][1]}. Actual title: ${title[0]}, price: ${price[0]}`,
                    );
                }
            },
            async () => await yandexMarketPage.saveScreenshot("error.png"),
        ),
    );

    it(
        "Refresh page",
        withErrorHandling(
            async () => {
                await yandexMarketPage.refreshPage();
                const savedText = await yandexMarketPage.getTextFromElement(By.xpath(yandexMarketPage.xpathSave));
                if (savedText !== "Сохранено") {
                    throw new Error(`Expected "Сохранено", got "${savedText}"`);
                }
            },
            async () => await yandexMarketPage.saveScreenshot("error.png"),
        ),
    );
});
