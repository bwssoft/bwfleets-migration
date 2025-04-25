import { clientSearchParams } from "@/view/params/clients-search.params";
import { parseAsInteger, createLoader, inferParserType } from "nuqs/server";

const params = {
  ...clientSearchParams,
  page: parseAsInteger,
};

export type IClientsPageParams = inferParserType<typeof params>;

export const loadClientsPageParams = createLoader(params);
