/*
 * @Author: LeeChar
 * @Date: 2020-11-23 01:26:55
 * @LastEditTime: 2020-11-23 15:27:21
 * @LastEditors: 李昌南
 * @Description: 初始化 mock 的配置文件
 * @FilePath: \mockServer\scripts\init.js
 */
const path = require("path");
const { writeFile } = require("fs/promises");

const filePath = path.resolve(process.cwd(), "./mock.js");

try {
  require(filePath);
} catch (error) {
  writeFile(filePath, "module.exports = []");
}
