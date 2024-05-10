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

export type editSearchFormType = {
  sportId?: string|number;
  pageNum?:number;
  pageSize?:number;
  beginTime?:string;
  endTime?:string;
}

export type { FormProps };
