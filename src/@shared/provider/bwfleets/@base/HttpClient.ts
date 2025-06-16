import axios, { Axios, AxiosResponse } from "axios"
import { HttpRequest } from "./@types"

export class HttpClient {
	private _client: Axios

	constructor(client?: Axios) {
		this._client = client || axios
	}

	async request(data: HttpRequest): Promise<AxiosResponse<any, any>> {
		const containParams = data.method === "get"
		const body = containParams ? { params: data.body } : { data: data.body }
		return await this._client.request({
			url: data.url,
			method: data.method,
			...body,
			headers: data.headers,
			responseType: data.responseType,
		})
	}
}
