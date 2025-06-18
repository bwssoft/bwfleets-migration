import { AxiosInstance } from "axios";
import api, { customAxios } from "./@base/api";
import { HttpClient } from "./@base/HttpClient";
import { IServiceHookHelper, IServiceHookHelperResponse } from "@/@shared/interfaces/ServiceHookHelper";
import { ServiceAPIHelper } from "@/@shared/utils/ServiceHookHelper";
import { NAuthService, NFindDtos, NUpdateDtos } from "./@base/@types";
import LocalStorageAdapter from "./@base/LocalStorageAdapter";
import { BFleetClient } from "@prisma/client";
import { ClientEntity, UserEntity } from "./@base/entities/client.entity";

export type ICreateOneClientReply = {
	response: {
		data: {
			uuid: string;
		}
	}
}

export type IGenerateAccessLinkReply = {
	response: {
		ttoken: string;
	}
}
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
		if (ttoken) {
			LocalStorageAdapter.set('ACCESS_TOKEN', { ttoken })
		}

		return response
	}

	async createOneClient(data: { data: Partial<BFleetClient> }) {
		const { serviceHookHelper } = this._serviceHelper

		const response = await serviceHookHelper("POST")<ICreateOneClientReply>({
			url: `/client/create-one`,
			data: data,
		})

		return response.data
	}

	async generateAccessLink(data: { query: { uuid: string } }) {
		const { serviceHookHelper } = this._serviceHelper

		const response = await serviceHookHelper("GET")<IGenerateAccessLinkReply>({
			url: `/client/init-validating-process`,
			data,
		})

		return response.data
	}

	async findOneClient(params: NFindDtos.FindOne.Params<ClientEntity>) {
		const { serviceHookHelper } = this._serviceHelper

		const response = await serviceHookHelper("GET")<NFindDtos.FindOne.Response<ClientEntity>>({
			url: `/client/find-one`,
			data: params,
		})

		return response.data
	}

	async updateOneClient(params: NUpdateDtos.UpdateOne.Params<ClientEntity>) {
		const { serviceHookHelper } = this._serviceHelper

		const response = await serviceHookHelper("PUT")<NUpdateDtos.UpdateOne.Response>({
			url: `/client/update-one`,
			data: params,
		})

		return response.data
	}

	async updateOneUser(params: NUpdateDtos.UpdateOne.Params<UserEntity>) {
		const { serviceHookHelper } = this._serviceHelper

		const response = await serviceHookHelper("PUT")<IGenerateAccessLinkReply>({
			url: `/user/update-one`,
			data: params,
		})

		return response.data
	}


  
}