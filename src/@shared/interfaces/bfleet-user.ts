import { BFleetClient } from "./bfleet-client";

export interface BFleetUser {
  id?: string;
  uuid?: string;
  name: string;
  email: string;
  client: Pick<BFleetClient, "uuid" | "name">;
  contact: string;
}
