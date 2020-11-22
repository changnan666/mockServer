/*
 * @Author: LeeChar
 * @Date: 2020-11-23 01:26:55
 * @LastEditTime: 2020-11-23 02:20:36
 * @LastEditors: LeeChar
 * @Description: 初始化 mock 的配置文件
 * @FilePath: \mockServer\scripts\init.js
 */
const path = require('path')
const { readFile, writeFile } = require('fs/promises')

let config = {}

const filePath = path.resolve(process.cwd(), './mock.js')

try {
	config = require(filePath)
} catch (error) {
	writeFile(filePath, 'module.exports = []')
}
