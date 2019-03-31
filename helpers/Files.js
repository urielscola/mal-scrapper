const fs = require("fs").promises;

const sortByName = (a, b) => {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  } else {
    return 0;
  }
};

class FileHelper {
  static async update(path, data) {
    try {
      const content = await fs.readFile(path);
      const newContent = [...JSON.parse(content), ...data];
      return await fs.writeFile(
        path,
        JSON.stringify(newContent.sort(sortByName)),
        {
          encoding: "utf8",
          flag: "w"
        }
      );
    } catch (err) {
      return new Error(err);
    }
  }

  static async readFile(path) {
    try {
      return await fs.readFile(path);
    } catch (err) {
      return new Error(err);
    }
  }
}

module.exports = FileHelper;
