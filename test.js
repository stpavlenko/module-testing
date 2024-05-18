const assert = require("assert");
const {Builder, Browser, By} = require("selenium-webdriver");
let driver = new Builder().forBrowser(Browser.CHROME).build();
let total = 5;
let remaining = 5;
lamdaTest();

async function lamdaTest() {
    try {
        await driver.get("https://lambdatest.github.io/sample-todo-app/ ");
        await driver.manage().window().maximize();
        await driver.sleep(1000);

        for (let i = 1; i <= total; i++) {
            let remainingElem = await driver.findElement(
                By.xpath("//span[@class='ng-binding']")
            );
            let text = await remainingElem.getText();
            let expectedText = `${remaining} of ${total} remaining`;
            assert.equal(text, expectedText);
            let item = await driver.findElement(
                By.xpath(`//input[@name='li${i}']/following-sibling::span`)
            );
            let itemClass = await item.getAttribute("class");
            assert.equal(itemClass, "done-false");
            await driver.findElement(By.name("li" + i)).click();
            remaining--;
            let newText = await remainingElem.getText();
            expectedText = `${remaining} of ${total} remaining`;
            assert.equal(newText, expectedText);
            await driver.sleep(1000);
            itemClass = await item.getAttribute("class");
            assert.equal(itemClass, "done-true");
        }
        await driver.findElement(By.id("sampletodotext")).sendKeys("New Item");
        await driver.sleep(1000);
        await driver.findElement(By.id("addbutton")).click();
        total++;
        remaining++;
        let item = await driver.findElement(
            By.xpath("//input[@name='li6']/following-sibling::span")
        );
        let itemText = await item.getText();
        let itemClass = await item.getAttribute("class");
        let remainingElem = await driver.findElement(
            By.xpath("//span[@class='ng-binding']")
        );
        let text = await remainingElem.getText();
        let expectedText = `${remaining} of ${total} remaining`;
        assert.equal(text, expectedText);
        assert.equal(itemText, "New Item");
        assert.equal(itemClass, "done-false");
        await driver.sleep(1000);
        await driver.findElement(By.name("li6")).click();
        remaining--;
        itemClass = await item.getAttribute("class");
        assert.equal(itemClass, "done-true");
        text = await remainingElem.getText();
        expectedText = `${remaining} of ${total} remaining`;
        assert.equal(text, expectedText);
        await driver.sleep(3000);
    } catch (e) {
        driver.takeScreenshot().then(function (image) {
            require("fs").writeFileSync("screenshot_error.png", image, "base64");
        });
        console.error(e);
    } finally {
        await driver.quit();
    }
}
