const path = require("path");
const { writeFile } = require("fs/promises");

const filePath = path.resolve(process.cwd(), "./mock.js");

try {
  require(filePath);
} catch (error) {
  writeFile(filePath, "module.exports = []");
}

// 重寫 console.log
const oldlog = global.console.log;

global.console.log = function (...args) {
  if (
    args[0] &&
    (args[0].indexOf("Note that the developme") !== -1 ||
      args[0].indexOf("To create a production ") !== -1)
  ) {
    return false;
  } else {
    return oldlog.call(this, ...args);
  }
};
