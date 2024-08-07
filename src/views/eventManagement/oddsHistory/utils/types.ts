
interface FormProps {
  levelList: ConfigCenterDataAPI.leagueLevelList[];
  formInline: MetadataAPI.LeagueList;
}

export type searchFormType = {
  leagueId: string;
  matchId: string;
  status: string;
  timeStart: string | number;
  timeEnd: string | number;
  category: string | number;
}

export type { FormProps };
