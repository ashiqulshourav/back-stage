declare namespace SattleDataAPI {
  type MatchEventsList = {
    canceled?: number | boolean;
    dataSourceCode?: string;
    eventCode?: string | number;
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
  };

  type MatchEventParams = {
    canceled?: number;
    eventCode?: string | number;
    eventTime?: Date | number | string;
    homeAway?: string;
    matchId?: number;
    matchPeriodId?: number;
    player1Name?: string;
    sourceType?: number;
    matchPeriod?: string;
    sportId?: number;
    dataSourceCode?: string;
    t1?: number;
    t2?: number;
    id?: number;
    gameRule?: string;
    inningNum?: number;
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
    unSettlementEvents: number;
    childrenData?: ChildrenDataList[];
    settlementType: number; //1 自动结算 //2 手动结算
    isShowCancelBtn?: boolean;
  };

  type ChildrenDataList = {
    type: string;
    key: 'matchScoreRecordList' | 'penaltyCardRecordList' | 'cornerRecordList';
    tableList: MatchEventsList[];
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

  type InningEvent = {
    id: number;
    uuid: string;
    matchId: number;
    canceled: number;
    eventTime: number | string;
    homeTeamId: number;
    awayTeamId: number;
    inningNum: number;
    setNum: number;
    t1: number | string;
    t2: number | string;
    sourceType: number;
    settleTimes: number;
    settleType: number;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    isEdit?: boolean;
    gameRule: string;
    inningEvents?: any[];
    t1Error: boolean;
    t2Error: boolean;
    eventTimeError: boolean;
  }

  type CommonEventData = {
    id?: number;
    uuid?: string;
    matchId?: number;
    canceled?: number | boolean;
    eventTime?: number | string | Date;
    homeTeamId?: number;
    awayTeamId?: number;
    t1?: number | string;
    t2?: number | string;
    sourceType?: number;
    settleTimes?: number;
    settleType?: number;
    gameRule?: string;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type BasketballEvent = CommonEventData & {
    eventCode?: string | number;
    extraInfo?: string;
    homeAway?: string;
    matchPeriod?: string;
  };

  type TennisEventsData = CommonEventData & {
    inningNum: number;
    setNum: number;
    inningEvents: InningEvent[];
    loading?: boolean;
  };

  type SnookerEventsResData = CommonEventData & {
    inningNum: number;
    homeTeamName?: any;
    awayTeamName?: any;
    isEdit?: boolean;
  };

  type volleyballData = SnookerEventsResData;
  type HockeyEventData = CommonEventData & { matchPeriod?: string };

  type getSettlementListRes = COMMON.BASE_RES_TYPE<getSettlementDataListRes>;
  type getTennisEventsResType = COMMON.BASE_RES_TYPE<TennisEventsData[]>;
  type addTennisEventResType = COMMON.BASE_RES_TYPE<any>;
  type addBadmintonEventResType = COMMON.BASE_RES_TYPE<any>;
  type getSnookerEventsResType = COMMON.BASE_RES_TYPE<SnookerEventsResData[]>;
  type getVolleyballEventsResType = COMMON.BASE_RES_TYPE<volleyballData[]>;
  type manualSettlementFullTimeRestType = COMMON.BASE_RES_TYPE<any>;
  type preSaleInfoResType = COMMON.BASE_RES_TYPE<getSettlementDataList>;
  type getBasketballEventRes = COMMON.BASE_RES_TYPE<BasketballEvent[]>;
  type getHockeyEventRes = COMMON.BASE_RES_TYPE<HockeyEventData[]>;
  type getBadmintonEventRes = COMMON.BASE_RES_TYPE<BasketballEvent[]>
  type getMatchEventsRes = COMMON.BASE_RES_TYPE<MatchEventsList[]>;  type cancelBetOrderResType = COMMON.BASE_RES_TYPE<null>


  type getSettlementHistoryParams = {
    isSale?: number;
    leagueId?: number;
    pageNum: number;
    pageSize: number;
    sportId?: number;
    status?: number;
    startTime?: number;
    endTime?: number;
  };

  type cancelMatchEventParams = {
    id: number;
    matchId: number;
    remark: string;
  };

  type addTennisEventReq = {
    eventTime: number | string;
    inningEvents: {
      eventTime: number | string;
      inningNum: number;
      matchId: number;
      setNum: number;
      t1: number | string;
      t2: number | string;
    }[];
    inningNum: number;
    matchId: number;
    t1: number;
    t2: number;
  };
  type SnookerEventReq = {
    eventTime: number | string;
    matchId: number;
    inningNum: number;
    t1: number | string;
    t2: number | string;
    gameRule: string;

  }
  type BadmintonEventReq = {
    eventTime: number | string | Date;
    matchId: number;
    inningNum: number;
    t1: number | string;
    t2: number | string;
    gameRule: string;

  }

  type getSettlementListPrams = {
    isSale?: number;
    leagueId?: number;
    pageNum?: number;
    pageSize?: number;
    sportId?: number;
    startTime?: number;
    matchId?: number;
    endTime?: number;
  };
}
