import { parseAsArrayOf, parseAsBoolean, parseAsString } from "nuqs/server";

export const clientSearchParams = {
  name: parseAsString,
  login: parseAsString,
  devicesOrderBy: parseAsString,
  withSubclients: parseAsBoolean,
  status: parseAsArrayOf(parseAsString),
};
