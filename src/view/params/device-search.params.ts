import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  inferParserType,
} from "nuqs";

export const deviceSearchParams = {
  ownerId: parseAsInteger,
  imei: parseAsString,
  name: parseAsString,
  model: parseAsArrayOf(parseAsString),
};

export type IDeviceSearchParams = inferParserType<typeof deviceSearchParams>;
