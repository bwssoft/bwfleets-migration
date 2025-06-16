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

export namespace NAuthService {
  export type Params = {
    password: string
    email: string
  }

  export type Response = { ok: boolean; response: { ttoken: string }}
} 