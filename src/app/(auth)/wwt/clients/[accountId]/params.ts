import { parseAsInteger, createLoader } from "nuqs/server";

const params = {
  subclientsPage: parseAsInteger,
  devicesPage: parseAsInteger,
};

export const loadClientDetailsPageParams = createLoader(params);
