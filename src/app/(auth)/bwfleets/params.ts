import { bfleetClientSearchParams } from "@/view/params/bfleet-client-search.params";
import { parseAsInteger, createLoader, inferParserType } from "nuqs/server";

const params = {
  ...bfleetClientSearchParams,
  page: parseAsInteger,
};

export type IBFleetClientsPageParams = inferParserType<typeof params>;

export const loadBfleetClientsPageParams = createLoader(params);
