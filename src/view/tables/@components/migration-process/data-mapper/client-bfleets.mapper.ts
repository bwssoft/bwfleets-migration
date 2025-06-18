import { IBFleetClient } from "@/@shared/interfaces";
import { ClientEntity } from "@/@shared/provider/bwfleets/@base/entities/client.entity";
import { removeSpecialCharacters } from "@/@shared/utils/removeSpecialCharacters";

export class ClientBfleetsMapper {
  static fomater(data: IBFleetClient) : Partial<ClientEntity> {
    const mountObject: Partial<ClientEntity> = {
      ...data,
      contacts: this.formatContact(data.contacts),
      address: this.formatAdress(data.address)
    }

    const cleanObject = this.removeExtraFields(mountObject);
    return cleanObject
  }

  private static removeExtraFields(data: Partial<ClientEntity>): Partial<ClientEntity> {
    const keyFields = [
      "updated_at",
      "theme",
      "id",
      "uuid",
      "parent_enterprise_uuid",
      "depth",
      "tenant",
      "enterprise_uuid",
      "restriction_uuid",
      "wwtAccountId",
      "user_uuid",
      "user",
      "migration"
    ]

    keyFields.map((field) => {
      delete data[field as keyof ClientEntity]
    })

    return data;
  }

  private static formatContact(data: IBFleetClient['contacts']) {
    return data.map(({ name, email, contact }) => ({ 
      name, 
      email, 
      contact: removeSpecialCharacters(`+55 ${contact}`)
    }))
  }

  private static formatAdress(data: IBFleetClient['address']): ClientEntity['address'] {
    return {
      ...data,
      cep: removeSpecialCharacters(data?.cep ?? ""),
    } as ClientEntity['address']
  }
}