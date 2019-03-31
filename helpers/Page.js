const puppeteer = require("puppeteer");
const ua = require("modern-random-ua");

const defaultConfig = {
  args: ["--start-fullscreen", "--no-sandbox"],
  headless: true
};

class Page {
  // This is where we'll put the code to get around the tests.
  static async prepare(page) {
    // Pass the User-Agent Test.
    const userAgent = ua.generate();
    await page.setUserAgent(userAgent);

    // Pass the Webdriver Test.
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => false
      });
    });

    // Pass the Chrome Test.
    await page.evaluateOnNewDocument(() => {
      // We can mock this in as much depth as we need for the test.
      window.navigator.chrome = {
        runtime: {}
        // etc.
      };
    });

    // Pass the Permissions Test.
    await page.evaluateOnNewDocument(() => {
      const originalQuery = window.navigator.permissions.query;
      return (window.navigator.permissions.query = parameters =>
        parameters.name === "notifications"
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters));
    });

    // Pass the Plugins Length Test.
    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, "plugins", {
        // This just needs to have `length > 0` for the current test,
        // but we could mock the plugins too if necessary.
        get: () => [1, 2, 3, 4, 5]
      });
    });

    // Pass the Languages Test.
    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, "languages", {
        get: () => ["pt-BR", "pt", "en-US", "en"]
      });
    });

    await page.setExtraHTTPHeaders({
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      Connection: "close",
      "Upgrade-Insecure-Requests": "1",
      "Accept-Encoding": "gzip, deflate, br"
    });
    await page.setViewport({ width: 1920, height: 1080 });
    return page;
  }

  static async create(config = defaultConfig) {
    const browser = await puppeteer.launch(config);
    const unPreparedPage = await browser.newPage();
    const page = await this.prepare(unPreparedPage);
    return { browser, page };
  }
}

module.exports = Page;
