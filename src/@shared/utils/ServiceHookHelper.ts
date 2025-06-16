import {
	IServiceHookHelperResponse,
	Method
} from "../interfaces/ServiceHookHelper"
import axios, { AxiosInstance } from "axios"

export const ServiceAPIHelper = (httpClient?: AxiosInstance) => {
	const _httpProvider = httpClient ?? axios.create()

	function serviceHookHelper<K extends keyof Method>(key: K) {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
		return async <R extends unknown>({
			data,
			...request
		}: Method[K]): Promise<IServiceHookHelperResponse<R>> => {
			const reqForParams = ["GET"] as (keyof Method)[]
			const body = reqForParams.includes(key) ? { params: data } : { data }

			const config = request.config ? { ...request.config } : undefined

			return await _httpProvider.request({
				url: request.url,
				method: key,
				...config,
				...body,
				responseType: (request as Method["GET"])?.responseType ?? undefined,
			})
		}
	}

	return {
		serviceHookHelper,
	}
}
