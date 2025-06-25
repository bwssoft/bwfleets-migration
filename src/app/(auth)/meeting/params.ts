import { meetingSearchParams } from "@/view/params/meeting-search.params";
import { parseAsInteger, createLoader, inferParserType } from "nuqs/server";

const params = {
  ...meetingSearchParams,
  page: parseAsInteger,
};

export type IMeetingPageParams = inferParserType<typeof params>;

export const loadMeetingPageParams = createLoader(params);
