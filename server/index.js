const { readFile, writeFile } = require('fs/promises')
const path = require('path')
const { v1 } = require('uuid')

const filePath = path.resolve(__dirname, '../mock.js')
const mockConfig = [...require(filePath)]

const projectNameIsExists = name => {
	for (const iterator of mockConfig) {
		if (iterator === name) {
			return true
		}
	}

	return false
}

const updateMockFile = () =>
	writeFile(filePath, `module.exports = ${JSON.stringify(mockConfig)}`)

const route = {
	'/getMockConfig': async send => {
		send({ data: mockConfig })
	},
	'/createProject': async (send, project) => {
		if (projectNameIsExists(project.projectName)) {
			return send({ code: 201, msg: '项目已存在' })
		}

		const id = v1()
		mockConfig.push({ projectName: project.projectName, id })

		await updateMockFile()
		send({ data: id })
	},
	'/deleteProject': async (send, params) => {
		const index = mockConfig.findIndex(item => item.id === params.id)

		mockConfig.splice(index, 1)
		await updateMockFile()

		send()
	},
	'/createPath': () => {
		console.log('创建地址')
	},
	'/deletePath': () => {
		console.log('删除地址')
	},
}

const sendAdapter = res => {
	return ({ code, msg, data } = { code: 200, msg: 'ok', data: {} }) => {
		res.send({
			code: code || 200,
			msg: msg || 'ok',
			data: data || {},
		})
	}
}

module.exports = app => {
	for (const path in route) {
		app.get(path, (req, res) => {
			res.type('application/json')
			const send = sendAdapter(res)
			route[path](send, req.query)
		})
	}
}
