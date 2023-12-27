declare namespace SaleDataAPI {
  type Sale = {
    matchId: number;
    countryId: number;
    sportId: number | string;
    leagueId: number;
    matchName: string;
    homeTeamId: number;
    awayTeamId: number;
    beginTime: string;
    beginTimeLong: number;
    playingField: string;
    isNeutral: number;
    level: number;
    isSale: number;
    videoUrl: string;
    status: string;
    currentScore: string;
    currentTime: string;
    currentPc: string;
    pandaResult: number;
    pandaMatchId: number;
    matchId188bet: number;
    childrenData: SattleDataAPI.MatchEventsList[];
  }
  type SaleListFetchProps = COMMON.ListFetchProps & {
    matchId?: number;
    matchName?: number;
    isSale?: number;
    beginTime?: string;
  }
  type SaleListData = COMMON.ListData<Sale>
  type SaleListRes = COMMON.ListRes<SaleListData>

  type PreSaleListRes = {
    code: number;
    msg: string;
    data: SaleListData;
  }


  type allSettlementRes = {
    code: number;
    msg: string;
    data: any;
  }


  type TeamList = {
    teamId: number;
    countryId: number;
    sportId: number;
    leagueId: number;
    teamNameCn: string;
    teamNameEn: string;
    teamLogo: string;
    level: number;
    isCountryTeam?: number;
    [key: string]: any;
  }


}