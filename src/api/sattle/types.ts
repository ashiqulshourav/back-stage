declare namespace SattleDataAPI {
  type MatchEventsList = {
    canceled?: number | boolean;
    dataSourceCode?: string;
    eventCode?: string;
    eventTime?: string | number | Date;
    createdAt?: number;
    extraInfo?: string;
    homeAway?: string;
    id?: number;
    matchId?: number;
    matchPeriodId?: number | string;
    matchType?: number;
    player1Id?: number;
    player1Name?: string;
    player2Name?: string;
    remark?: string;
    player2Id?: number;
    sourceType?: number;
    sportId?: number;
    t1?: number | string;
    t2?: number | string;
    isEdit?: boolean;
    isSave?: boolean;
    redOrYellow?: number | string;
    isBackEndReturnData: boolean;
    xjFlag: number;
    psFlag: number;
    vsFlag: number;
    settleType: number;
    settleTimes: number;
    t: number;
    isSettleStatus: boolean;
    isShowCount: boolean;
  }

  type getMatchEventsRes = COMMON.BASE_RES_TYPE<MatchEventsList[]>

  type MatchEventParams = {
    canceled?: number;
    eventCode?: string;
    eventTime?: Date | number;
    homeAway?: string;
    matchId?: number;
    matchPeriodId?: number;
    player1Name?: string;
    sourceType?: number;
    sportId?: number;
    dataSourceCode?: string;
    t1?: number;
    t2?: number;
    id?: number;
  }


  type getSettlementDataList = {
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
    halfSettlementStatus: number;
    fullSettlementStatus: number;
    matchCondition?: any;
    startTime?: any;
    endTime?: any;
    pageSize: number;
    pageNum: number;
    childrenData: ChildrenDataList[];
    settlementType: number; //1 自动结算 //2 手动结算
  }

  type ChildrenDataList = {
    type: string;
    key: 'matchScoreRecordList' | 'penaltyCardRecordList' | 'cornerRecordList' | 'endGameEventList';
    tableList: MatchEventsList[]
  };

  type getSettlementDataListRes = {
    total: number;
    list: getSettlementDataList[];
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

  type getSettlementListRes = COMMON.BASE_RES_TYPE<getSettlementDataListRes>

}