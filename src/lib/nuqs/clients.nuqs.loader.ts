import { parseAsFloat, createLoader, parseAsString } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const clientsSearchParams = {
  page: parseAsFloat.withDefault(0),
  accountName: parseAsString,
};

export const loadClientsSearchParams = createLoader(clientsSearchParams);
