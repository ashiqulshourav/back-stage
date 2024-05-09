interface FormProps {
  matchDetail: MatchCombineAPI.matchSourceDetail;
}

export type searchFormType = {
  dataSource?: string;
  sportId?: string;
  matchId?: string;
  leagueNameCn?: string;
  competitionDate?: number;
  leagueNameEn?: string;
  homeTeamNameCn?: string;
  homeTeamNameEn?: string;
  awayTeamNameCn?: string;
  awayTeamNameEn?: string;
  mathcMethod?: string;
  category?: number;
}

export type { FormProps };