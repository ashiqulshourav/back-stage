
interface FormProps {
  formInline: MetadataAPI.LeagueList;
}

export type searchFormType = {
  matchId: string;
  startTime: string;
  endTime: string;
  countryId: string;
  leagueId: string;
  sportId: string | number;
}

export type { FormProps };
