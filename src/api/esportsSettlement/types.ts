declare namespace EsportsSettlementAPI {
  type ESportMatchList = {
    matchId: number;
    countryId: number;
    sportId: number;
    leagueId: number;
    leagueNameCn: string;
    matchName: string;
    homeTeamId: number;
    homeTeamNameCn: string;
    awayTeamId: number;
    awayTeamNameCn: string;
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
    pandaVideoId: string;
    pandaMatchId: number;
    pandaLinkId: string;
    pandaOppositeStatus: number;
    category?: any;
    halfSettlementStatus: number;
    fullSettlementStatus: number;
    settlementType?: any;
    matchCondition?: any;
    videoReverse: number;
    startTime?: any;
    endTime?: any;
    leagueIds?: any;
    saleHandicaps?: any;
    allHandicaps?: any;
    handicapStatus: number;
    unSettlementEvents?: any;
    pageSize: number;
    pageNum: number;
  }

  type ESportMatchListData = {
    total: number;
    list: ESportMatchList[];
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

  type getESportMatchListResType = COMMON.BASE_RES_TYPE<ESportMatchListData>

  type getESportMatchListReqParams = {
    awayTeamId?: number;
    beginTime?: number;
    beginTimeLong?: number;
    countryId?: number;
    isSale?: number;
    leagueId?: number;
    matchName?: string;
    matchId?: number;
    pageNum?: number;
    pageSize?: number;
    sportId?: number;
    status?: number;
    startTime?: string;
    endTime?: string;
  }
}