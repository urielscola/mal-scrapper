const MalJob = require("./jobs/MalJob");
const TagJob = require("./jobs/TagsJob");

const watched = require("./resources/watchedArray");
const toWatch = require("./resources/toWatchArray");

const logger = require("./logger");

(async () => {
  logger.info("[MalJob] - Animes Start");
  await MalJob.run("data/animes.json", watched, { watched: true });
  await MalJob.run("data/animes.json", toWatch, { watched: false });
  logger.info("[MalJob] - Animes Finish");
  logger.info("[TagJob] - TagJob Start");
  await TagJob.run();
  logger.info("[TagJob] - TagJob Finish");
})();
