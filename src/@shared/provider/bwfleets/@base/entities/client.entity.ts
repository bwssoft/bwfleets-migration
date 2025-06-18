import { BFleetClient } from "@prisma/client";

export type ClientEntity = Omit<BFleetClient, 'contacts'> & {
  ww_account_id: string
  contacts: Array<Omit<BFleetClient['contacts'][0], 'role'>>
}

export type UserEntity = {
  uuid: string
	name: string
	email: string
	password?: string
	password_token?: string
	last_login?: Date
	last_logout?: Date
	blocked?: boolean
	client: Pick<ClientEntity, "uuid" | "name">
	profile_uuid: string[]
	contact: string
	play_sound_on_alarm?: boolean
	constraint_uuid?: string
}