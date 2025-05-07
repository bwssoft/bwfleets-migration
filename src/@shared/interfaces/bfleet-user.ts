import { IBFleetClient } from "./bfleet-client";

export interface BFleetUser {
  id?: string;
  uuid?: string;
  name: string;
  email: string;
  client: Pick<IBFleetClient, "uuid" | "name">;
  contact: string;
}
