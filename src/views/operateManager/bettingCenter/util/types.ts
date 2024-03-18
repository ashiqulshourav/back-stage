
export type searchFormType = {
  sportId: string;
  userIdOrName: string;
  beginTimeStart?: number | string;
  beginTimeEnd?: number | string;
  createTimeStart: number | string;
  createTimeEnd: number | string;
  orderId: string;
  leagueId: string;
  matchId: string;
  agentId: number;
  awayTeamNameCn: string;
  homeTeamNameCn: string;
  leagueNameEn: string;
  leagueNameCn: string;
  category: string | number;
  [key: string]: any;
}
