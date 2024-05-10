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
  startTime:string;
  endTime:string;
}

export type editSearchFormType = {
  sportId?: string|number;
  category:number;
  pageNum:number;
  pageSize:number;
  startTime:string|null;
  endTime:string|null;
  matchId188bet:number|null;
}

export type { FormProps };
