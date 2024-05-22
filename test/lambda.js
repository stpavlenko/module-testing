const LambdaTestPage = require("../pages/lambda.js");
const {describe, it, before, after} = require("mocha");
const {expect} = require("chai");

describe("Lambda", function () {
    this.timeout(15000);
    let testPage;

    before(async () => {
        testPage = new LambdaTestPage(5, 5);
        await testPage.open();
    });

    after(async () => {
        await testPage.closeBrowser();
    });

    it("Verifies text on remaining items", async () => {
        expect(
            await testPage.checkRemainingElem(),
            "Mismatch in remaining items text"
        ).to.be.true;
    });

    it("Ensures the first item is initially inactive", async () => {
        const firstElement = await testPage.getItem(1);
        expect(
            await testPage.isItemNotActive(firstElement),
            "First element should start as inactive"
        ).to.be.true;
    });

    it("Activates the first item and checks updated status and text", async () => {
        const firstElement = await testPage.getItem(1);
        await testPage.clickItem(1);
        expect(
            await testPage.isItemActive(firstElement),
            "First element should be active after being clicked"
        ).to.be.true;
        expect(
            await testPage.checkRemainingElem(),
            "Remaining items text should update after action"
        ).to.be.true;
    });

    it("Tests inactivity of items and activates each", async () => {
        for (let i = 2; i <= testPage.total; i++) {
            const eachItem = await testPage.getItem(i);
            expect(
                await testPage.isItemActive(eachItem),
                `Item ${i} should be inactive initially`
            ).to.be.false;
            await testPage.clickItem(i);
            expect(
                await testPage.isItemActive(eachItem),
                `Item ${i} should turn active on click`
            ).to.be.true;
            expect(
                await testPage.checkRemainingElem(),
                "Remaining items text should refresh accurately"
            ).to.be.true;
        }
    });

    it("Tests addition of a new item and its initial state", async () => {
        await testPage.addItem("New test item");
        const newItem = await testPage.getItem(testPage.total);
        expect(
            await testPage.isItemActive(newItem),
            "Newly added item must be inactive at start"
        ).to.be.false;
        expect(
            await testPage.checkRemainingElem(),
            "Text on remaining items should update post addition"
        ).to.be.true;
    });

    it("Tests clicking the newest item", async () => {
        await testPage.clickItem(testPage.total);
        expect(
            await testPage.checkRemainingElem(),
            "Remaining items text should update after new item click"
        ).to.be.true;
    });
});
