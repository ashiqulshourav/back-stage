declare namespace SaleDataAPI {
  type PreSaleList = {
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
    awayTeamNameCn: string;
    homeTeamNameCn: string;
    halfSettlementStatus: number;
    fullSettlementStatus: number;
    childrenData: ChildrenDataList[];
  }

  type ChildrenDataList = {
    type: string;
    key: string;
    tableList: SattleDataAPI.MatchEventsList[]
  };

  type PreSaleListData = {
    total: number;
    list: PreSaleList[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
  }

  type PreSaleListRes = {
    code: number;
    msg: string;
    data: PreSaleListData;
  }

  type deleteMatchEventRes = {
    code: number;
    msg: string;
    data: any;
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