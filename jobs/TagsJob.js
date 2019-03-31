const FileHelper = require("../helpers/Files");

function flattenDeep(arr1) {
  return arr1.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
    []
  );
}

class TagJob {
  static async run() {
    const watched = await FileHelper.readFile("data/animes.json");
    const tags = flattenDeep([
      ...JSON.parse(watched).map(anime => anime.genres)
    ]).sort();
    const uniqueTags = new Set(tags);
    await FileHelper.update("data/tags.json", uniqueTags);
  }
}

module.exports = TagJob;
