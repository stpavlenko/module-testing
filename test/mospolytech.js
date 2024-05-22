const MospolytechPage = require("../pages/mospolytech");
const {describe, before, after, it} = require('mocha');
const {expect} = require('chai');

describe("Mospolytech Integration Tests", function () {
    this.timeout(20000);
    const mospolytechPage = new MospolytechPage();

    before(async () => {
        await mospolytechPage.openMospolytech();
    });

    after(async () => {
        await mospolytechPage.closeBrowser();
    });

    it("Opens and navigates to the schedule page", async () => {
        try {
            await mospolytechPage.navigateToSchedule();
        } catch (error) {
            await mospolytechPage.takeScreenshot('error.png');
            throw error;
        }
    });

    it("Searches for a group and selects it from results", async () => {
        try {
            await mospolytechPage.searchAndSelectGroup('221-321');
        } catch (error) {
            await mospolytechPage.takeScreenshot('error.png');
            throw error;
        }
    });

    it("Checks if the current day is highlighted", async () => {
        try {
            const isHighlighted = await mospolytechPage.isCurrentDayHighlighted();
            expect(isHighlighted).to.be.true;
        } catch (error) {
            await mospolytechPage.takeScreenshot('error.png');
            throw error;
        }
    });
});
