import { IBFleetClient } from "@/@shared/interfaces";
import { schema as ClientSchema } from "@/view/forms/create-client-bwfleet/useCreateClientBwfleet"
import { z } from "zod";

type IClientSchemaType = z.infer<typeof ClientSchema>;

type ICustomClientSchemaType = Omit<IClientSchemaType, 'user'> & {
  user: Partial<IClientSchemaType['user']>
}

export class ClientSchemaMapper {
  static formater (data?: IBFleetClient): Partial<ICustomClientSchemaType | undefined> {

    if(!data) return

    return {
      cep: this.formatValue(data.address?.cep),
      city: this.formatValue(data.address?.city),
      contacts: data.contacts as IClientSchemaType['contacts'],
      country: {
        name: this.formatValue(data.address?.country)
      },
      district: this.formatValue(data.address?.district),
      document: data.document?.value ?? undefined,
      document_type: this.formatValue(data.document?.type) as IClientSchemaType['document_type'],
      name: this.formatValue(data.name),
      number: this.formatValue(data.address?.number),
      state: this.formatValue(data.address?.state),
      street: this.formatValue(data.address?.street),
      subdomain: data.subdomain,
      user: {
        name: this.formatValue(data.user?.name),
        email: this.formatValue(data.user?.email),
        contact: this.formatValue(data.user?.contact),
        full_name: this.formatValue(data.user?.full_name),
      }
    }
  }

  private static formatValue<T>(data: T) {
    if(!data) return undefined

    return data;
  }
}