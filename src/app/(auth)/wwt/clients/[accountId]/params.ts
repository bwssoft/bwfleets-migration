import { parseAsInteger, createLoader } from "nuqs/server";

const params = {
  subclientsPage: parseAsInteger,
};

export const loadClientDetailsPageParams = createLoader(params);
