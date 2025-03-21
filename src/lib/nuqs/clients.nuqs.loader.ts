import { parseAsFloat, createLoader } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const clientsSearchParams = {
  page: parseAsFloat.withDefault(1),
};

export const loadClientsSearchParams = createLoader(clientsSearchParams);
