declare namespace BetOrderAPI {

  type Detail = {
    betResult: string;
    betHandicap: string;
    sportNameCn: string;
    leagueNameCn: string;
    awayTeamNameCn: string;
    marketType: string;
    homeTeamNameCn: string;
    kindsCode: string;
    oddFinally: string;
    sportId: string;
    beginTime: string;
    betHomeOrAway: string;
    betItemId: string;
    settleScore: string;
    scoreBenchmark?: string;
  }



  type BetOrderList = {
    id: string;
    userId: string;
    userName: string;
    orderAmount: number;
    profitAmount?: any;
    settleAmount?: any;
    createTime: string;
    updateTime?: any;
    updateUser?: any;
    settleTime?: any;
    settleTimes: number;
    status: number;
    billStatus: number;
    seriesType: number;
    isInplay: number;
    marketType: number;
    oddValue?: any;
    marketTypeFinally: number;
    oddFinally: number;
    sportId: number;
    sportNameCn: string;
    sportNameEn: string;
    matchId: number;
    matchNameCn: string;
    matchNameEn: string;
    homeTeamNameCn: string;
    homeTeamNameEn: string;
    awayTeamNameCn: string;
    awayTeamNameEn: string;
    scoreBenchmark: string;
    settleScore?: any;
    betItemCTID: number;
    beginTime: string;
    leagueId: number;
    leagueNameCn: string;
    leagueNameEn: string;
    betItemId: number;
    betItemName: string;
    betHandicap: string;
    betHomeOrAway: string;
    kindsCode: string;
    betResult?: any;
    category: number;
  }

  type otherDataType = {
    thisPageBetTotalProfitAmount: number;
    thisPageBetUserCount: number;
    thisPageBetTotalAmount: number;
    thisPageBetCount: number;
  }

  type BetOrderData = {
    pageSize: number;
    pageNum: number;
    count: number;
    groupCount: null;
    pageData: BetOrderList[];
    otherData: otherDataType
  }

  type settleReqType = {
    betItemId: string | number | null;
    betResult: null | number | string;
    awayTeamScore: null | number;
    matchId: number | string;
    handicap: string | number;
    homeTeamScore: null | number;
    settlementTimes: number | string;
  }

  type BetOrderResType = COMMON.BASE_RES_TYPE<BetOrderData>
  type orderListDownLoadResType = COMMON.BASE_RES_TYPE<BetOrderList[]>
  type StatusResType = COMMON.BASE_RES_TYPE<null>
}
