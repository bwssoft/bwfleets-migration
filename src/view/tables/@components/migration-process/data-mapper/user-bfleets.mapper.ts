import { IBFleetClient } from "@/@shared/interfaces";
import { UserEntity } from "@/@shared/provider/bwfleets/@base/entities/client.entity";
import { removeSpecialCharacters } from "@/@shared/utils/removeSpecialCharacters";

export class UserBfleetsMapper {
  static formatter(data?: IBFleetClient['user']): Partial<UserEntity> {
    return {
      email: this.formatValue(data?.email),
      name: this.formatValue(data?.full_name),
      contact: removeSpecialCharacters(`+55 ${data?.contact}`),
      updated_at: new Date(),
    }
  }

  private static formatValue<T>(data: T) {
    if(!data) return undefined

    return data;
  }
}