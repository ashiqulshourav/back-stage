declare namespace EventAPI {
  type PandaMatchEventListParams = {
    matchId?: number | string;
    dataSourceCode?: string | number;
    eventCode?: string[] | string | '';
    startTime?: number | string;
    endTime?: number | string;
    pageSize?: number;
    pageNum?: number;
    operationMethod?: string;
    canceled?: string | number;
  };

  type MatchInfo = {
    aTeamName: string;
    hTeamName: string;
    leagueId: string;
    league: string;
    matchId: string;
    riskLevel: string;
    sportName: string;
    level: string;
    startDateTime: string;
  };

  type PandaMatchEventList = {
    eventCode: string;
    eventName: string;
  };

  type PandaMatchEventListRes = {
    data: {
      eventCode: string;
      eventName: string;
    }[];
  };

  type MatchEvent = {
    addition1?: string | number;
    addition2?: string | number;
    addition3?: string | number;
    addition4?: string | number;
    addition5?: string | number;
    addition6?: string | number;
    addition7?: string | number;
    addition8?: string | number;
    addition9?: string | number;
    addition10?: string | number;
    aoThirdMatchSourceId?: string | number;
    canceled?: string | number;
    createTime?: string | number;
    createdAt?: string | number;
    dataSourceCode?: string | number;
    eventCode?: string | number;
    eventTime?: string | number;
    extraInfo?: string | number;
    firstNum?: string | number;
    firstT1?: string | number;
    firstT2?: string | number;
    fragmentCode?: string | number;
    fragmentId?: string | number;
    fragmentLength?: string | number;
    fragmentPic?: string | number;
    fragmentVideo?: string | number;
    homeAway?: string | number;
    id?: string | number;
    isErrorEndEvent?: string | number;
    matchId?: string | number;
    matchPeriodId?: string | number;
    matchType?: string | number;
    modifyTime?: string | number;
    penaltyShootoutRound?: string | number;
    periodRemainingSeconds?: string | number;
    player1Id?: string | number;
    player1Name?: string | number;
    player2Id?: string | number;
    player2Name?: string | number;
    playerIdPrefix?: string | number;
    remark?: string | number;
    secondNum?: string | number;
    secondT1?: string | number;
    secondT2?: string | number;
    secondsFromStart?: string | number;
    sourceType?: string | number;
    sportId?: string | number;
    standardMatchId?: string | number;
    standardTeamId?: string | number;
    t1?: string | number;
    t2?: string | number;
    thirdEventId?: string | number;
    thirdMatchId?: string | number;
    thirdMatchSourceId?: string | number;
    thirdTeamId?: string | number;
  };

  type matchEventList = {
    total: number;
    list: MatchEvent[];
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
  };

  type getMatchEventByMatchIdResType = COMMON.BASE_RES_TYPE<matchEventList>;

  type lType = {
    teamName: string;
    ht1: number;
    ht2: number;
    goal: number;
    corner: number;
    yellow_card: number;
    red_card: number;
  };

  type EventData = {
    type: keyof lType;
    n: number | string;
    time: number | string;
  };

  type Event = {
    away: EventData[];
    home: EventData[];
  };

  type getMatchStatusticData = {
    beginTime: string;
    homeTeamNameCn: string;
    awayTeamNameCn: string;
    homeTeamLogo: string;
    awayTeamLogo: string;
    bet: {
      n: string;
      o: string;
      t: string;
    }[];
    event: Event[];
    matchStatus: string;
  };

  type getMatchStatusticResType = COMMON.BASE_RES_TYPE<getMatchStatusticData>;

  type CombineOrderDetail = {
    detailId: string;
    settleStatus: number;
    isInplay: number;
    marketType: number;
    oddValue: number;
    marketTypeFinally: number;
    oddFinally: number;
    sportId: string;
    sportNameCn: string;
    sportNameEn: string;
    matchId: string;
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
    leagueId: string;
    leagueNameCn: string;
    leagueNameEn: string;
    betItemId: string;
    betItemName: string;
    betHandicap: string;
    betHomeOrAway: string;
    kindsCode: string;
    kindsName: string;
    betResult: number;
    category: number;
    betN: string;
    currency: string;
    riskStatus: number;
    riskTimes: number;
    riskType: string;
    orderDetailRemark: string;
  };

  type PageData = {
    id: string;
    userId: string;
    userName: string;
    tenantId: string;
    tenantCode: string;
    orderAmount: number;
    productAmountTotal: number;
    profitAmount?: any;
    settleAmount?: any;
    createTime: string;
    updateTime: string;
    updateUser: string;
    settleTime?: any;
    settleTimes: number;
    status: number;
    displayStatus: number;
    billStatus: number;
    isReserve: number;
    seriesType: number;
    combineOrderDetails: CombineOrderDetail[];
    isSettlementAgain: number;
    maxWinAmount?: any;
    currency: string;
    isSpecialSettle: number;
    orderRemark: string;
    riskControlLabelList?: any;
  };

  type getMatchBetListResTypeData = {
    count: number;
    groupCount?: any;
    pageNum: number;
    pageSize: number;
    pageData: PageData[];
    otherData?: any;
  };

  type getMatchBetListResType =
    COMMON.BASE_RES_TYPE<getMatchBetListResTypeData>;
}
