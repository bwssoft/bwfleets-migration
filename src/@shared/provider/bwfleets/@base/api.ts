/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios, { AxiosError } from "axios"
import qs from "qs"

import { HttpClient } from "./HttpClient"
import LocalStorageAdapter from "./LocalStorageAdapter"
console.log("API_HOST", process.env.NEXT_PUBLIC_API_HOST)
export const customAxios = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API_HOST}`,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
	paramsSerializer: function (params) {
		return qs.stringify(params, {
			allowEmptyArrays: false,
			skipNulls: false,
			strictNullHandling: true,
		})
	},
})

customAxios.interceptors.request.use(async (config) => {
	const ttoken = LocalStorageAdapter.get<{ ttoken: string }>('ACCESS_TOKEN')

  if(config.headers) {
    config.headers.ttoken = ttoken?.ttoken as string
		config.headers.tsub = "tsub"
  }

	return config
})

// Add a request interceptor
customAxios.interceptors.response.use(
	async (config) => {
		return config
	},
	async (error: AxiosError) => {
		const { request } = error

		const status = request?.status

		if (status === 401 || status === 403) {
			localStorage.clear()
			window.location.reload()
		}

		return Promise.reject(error)
	}
)

export default () => new HttpClient(customAxios)
