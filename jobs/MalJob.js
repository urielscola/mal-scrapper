const PageHelper = require("../helpers/Page");
const FileHelper = require("../helpers/Files");

class MalJob {
  static async run(saveFile, srcArray, { watched }) {
    const results = [];

    const { browser, page } = await PageHelper.create();

    return new Promise(async (resolve, reject) => {
      try {
        for (var i = 0; i < srcArray.length; i++) {
          await page.goto(srcArray[i]);
          const name = await page.$eval(
            `[itemprop="name"]`,
            e => e.textContent
          );

          const image = await page.$eval(`[itemprop="image"]`, e => e.src);

          const genres = await page.$$eval(`.dark_text`, nodes => {
            const raw = [...nodes].filter(
              node => node.textContent.indexOf("Genres") > -1
            )[0];
            return raw
              ? [...raw.parentNode.querySelectorAll("a")].map(genre =>
                  genre.textContent.trim()
                )
              : [];
          });
          const description = await page.$eval(
            `[itemprop="description"]`,
            e => e.textContent
          );
          const episodes = await page.$$eval(`.spaceit .dark_text`, nodes => {
            const rawText = [...nodes].filter(
              node => node.textContent.indexOf("Episodes") > -1
            )[0];

            return rawText
              ? rawText.parentNode.textContent
              : "Unable to fetch episodes";
          });

          results.push({
            name,
            image,
            description: description
              .replace("[Written by MAL Rewrite]", "")
              .trim(),
            genres,
            episodes: episodes
              .trim()
              .replace("Episodes:", "")
              .trim(),
            watched
          });
        }
        // finish
        await browser.close();
        await FileHelper.update(saveFile, results);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = MalJob;
