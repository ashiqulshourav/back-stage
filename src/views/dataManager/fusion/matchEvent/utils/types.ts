interface FormProps {
  levelList: ConfigCenterDataAPI.leagueLevelList[];
  formInline: MetadataAPI.LeagueList;
}

export type searchFormType = {
  dataSource: string;
  sportId: string;
  matchId: string;
  leagueNameCn: string;
  competitionDate: number;
  leagueNameEn: string;
  homeTeamNameCn: string;
  homeTeamNameEn: string;
  awayTeamNameCn: string;
  awayTeamNameEn: string;
  mathcMethod: string;
}

export type { FormProps };