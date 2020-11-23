import { message } from 'antd'
import axios from 'axios'

const instance = axios.create()

instance.interceptors.response.use(
	function (response) {
		if (response.data.code !== 200) {
			message.error(response.data.msg)
			return Promise.reject()
		}

		if (response.data.data) {
			return response.data
		}

		return response
	},
	function (error) {
		return Promise.reject(error)
	}
)

export const get = <T>(url: string, params: any = {}) =>
	instance.get<T>(url, { params })

export const api = {
	getAllConfig: '/getMockConfig',
	createProject: '/createProject',
	deleteProject: '/deleteProject',
}
