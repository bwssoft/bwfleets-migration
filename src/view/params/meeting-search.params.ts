import { parseAsString } from "nuqs/server";

export const meetingSearchParams = {
  clientName: parseAsString,
  status: parseAsString,
  clientNameOrderBy: parseAsString,
  dateOrderBy: parseAsString,
}