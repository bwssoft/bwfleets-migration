import { AxiosInstance } from "axios";
import api, { customAxios } from "./@base/api";
import { HttpClient } from "./@base/HttpClient";
import { IServiceHookHelper, IServiceHookHelperResponse } from "@/@shared/interfaces/ServiceHookHelper";
import { ServiceAPIHelper } from "@/@shared/utils/ServiceHookHelper";
import { NAuthService } from "./@base/@types";
import LocalStorageAdapter from "./@base/LocalStorageAdapter";

export class BWFleetsProvider {
  protected _httpClient: HttpClient
  protected _httpProvider: AxiosInstance
  protected _serviceHelper: IServiceHookHelper

  constructor() {
    this._httpClient = api()
    this._httpProvider = customAxios
    this._serviceHelper = ServiceAPIHelper(this._httpProvider)
  }

  async authenticate(
		params: NAuthService.Params
	): Promise<IServiceHookHelperResponse<NAuthService.Response>> {
		const { serviceHookHelper } = this._serviceHelper

		const response = await serviceHookHelper(
			"POST"
		)<NAuthService.Response>({
			url: `/auth/authenticate`,
			data: params,
		})

		const { ttoken } = response.data.response
    console.log("ttoken", ttoken)
		if (ttoken) {
			LocalStorageAdapter.set('ACCESS_TOKEN', { ttoken })
		}

		return response
	}
  
}