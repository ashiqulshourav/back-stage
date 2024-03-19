
export type searchFormType = {
  pageSize?:number|string;
  pageNum?:number|string;
  sportId: string;
  userIdOrName: string;
  createTimeStart: number | string;
  createTimeEnd: number | string;
  orderId: string;
  leagueId: string;
  matchId: string;
  awayTeamNameCn: string;
  homeTeamNameCn: string;
  seriesType:number|string;
  settleStatus:number|string;
  isInplay:number|string;
  category:string|number;
  [key: string]: any;
}
