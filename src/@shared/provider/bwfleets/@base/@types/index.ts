import { NUtilsDtos } from "./partials.dto"

export type HttpMethod = "post" | "get" | "put" | "delete" | "patch"

export type HttpRequest = {
	url: string
	method: HttpMethod
	body?: any
	headers?: any
	responseType?:
		| "arraybuffer"
		| "blob"
		| "document"
		| "json"
		| "text"
		| "stream"
}

export interface UsecaseResponse<T = undefined> {
	ok: boolean
	response: T
}

export namespace NAuthService {
  export type Params = {
    password: string
    email: string
  }

  export type Response = { ok: boolean; response: { ttoken: string }}
} 

export namespace NUpdateDtos {
	export namespace UpdateOne {
		export interface Params<E> {
			query: NUtilsDtos.Query<E>
			value: NUtilsDtos.Value<E>
			replace?: boolean
		}
 		export interface Response {
			ok: boolean
		}
	}
}

export namespace NFindDtos {
	export namespace FindOne {
		export interface Params<T> {
			query: NUtilsDtos.Query<T>
			lookup?: NUtilsDtos.Lookup[]
		}

		export type Response<T> =
			UsecaseResponse<{
				data: T
				metadata: NUtilsDtos.Metadata
			}>
	}
}