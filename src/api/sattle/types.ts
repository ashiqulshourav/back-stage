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
    t1Y?: number;
    t2Y?: number;
    t1R?: number;
    t2R?: number;
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
    gameRule?: string | number;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type BasketballEvent = {
    awayTeamId?: number;
    canceled?: number | boolean;
    createdAt?: number;
    eventTime?: string | number | Date;
    homeTeamId?: number;
    eventCode?: string | number;
    extraInfo?: string;
    homeAway?: string;
    id?: number;
    matchId?: number;
    matchPeriod?: string;
    settleTimes?: number;
    settleType?: number;
    sourceType?: number;
    t1?: number | string;
    t2?: number | string;
    updatedAt?: number;
    updatedBy?: number;
    uuid?: string;
    gameRule?: 'INNING' | 'HT';
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
    t1?: number | string;
    t2?: number | string;
    id?: number;
    gameRule?: string;
    inningNum?: number;
  };
  // type MatchEvent = {
  //   awayTeamId?: number;
  //   canceled?: number | boolean;
  //   createdAt?: number;
  //   createdBy?: string;
  //   eventTime?: string | number | Date;
  //   homeTeamId?: number;
  //   eventCode?: string | number;
  //   extraInfo?: string;
  //   homeAway?: string;
  //   id?: number;
  //   matchId?: number;
  //   matchPeriod?: string;
  //   settleTimes?: number;
  //   settleType?: number;
  //   sourceType?: number;
  //   t1?: number | string;
  //   t2?: number | string;
  //   updatedAt?: number;
  //   updatedBy?: string;
  //   uuid?: string;
  // };
  type HandballEvent = CommonEventData & {
    inningNum: number;
    isEdit?: boolean;
    homeTeamName?: any;
    awayTeamName?: any;
    matchPeriod?: string;
  };
  type IceHockeyEvent = HandballEvent;
  type CricketEvent = HandballEvent;


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
    cancelOrderTimes?: number;
    unSettlementEvents: number;
    childrenData?: ChildrenDataList[];
    settlementType: number; //1 自动结算 //2 手动结算
    isShowCancelBtn?: boolean;
    periodType?: number;
  };

  type ChildrenDataList = {
    type: string;
    val: string;
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
  };

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
  };

  type TennisEventsData = {
    id: number;
    uuid: string;
    matchId: number;
    canceled: number;
    eventTime: number | string;
    homeTeamId: number;
    awayTeamId: number;
    inningNum: number;
    setNum: number;
    t1: number;
    t2: number;
    sourceType: number;
    settleTimes: number;
    settleType: number;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    gameRule: string;
    inningEvents: InningEvent[];
    loading?: boolean;
  };
  type BasketBallEventsData = {
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
    gameRule: string;
    inningEvents: InningEvent[];
    loading?: boolean;
    matchPeriod?: string;
    isEdit: boolean;
  };

  type SnookerEventsResData = CommonEventData & {
    inningNum: number;
    homeTeamName?: any;
    awayTeamName?: any;
    isEdit?: boolean;
  };

  type volleyballData = SnookerEventsResData;
  type HockeyEventData = CommonEventData & { matchPeriod?: string };
  type BoxingEventData = CommonEventData & { matchPeriod?: string };
  type DartsEventData = CommonEventData & { matchPeriod?: string };
  type basketballData = SnookerEventsResData;
  type badmintonData = SnookerEventsResData;
  type pingpongData = SnookerEventsResData;
  type rugbyData = SnookerEventsResData;


  type getSettlementListRes = COMMON.BASE_RES_TYPE<getSettlementDataListRes>;
  type getTennisEventsResType = COMMON.BASE_RES_TYPE<TennisEventsData[]>;
  type addTennisEventResType = COMMON.BASE_RES_TYPE<any>;
  type addBadmintonEventResType = COMMON.BASE_RES_TYPE<any>;
  type addRugbyEventResType = COMMON.BASE_RES_TYPE<any>;

  type getSnookerEventsResType = COMMON.BASE_RES_TYPE<SnookerEventsResData[]>;
  type getVolleyballEventsResType = COMMON.BASE_RES_TYPE<volleyballData[]>;
  type manualSettlementFullTimeRestType = COMMON.BASE_RES_TYPE<any>;
  type preSaleInfoResType = COMMON.BASE_RES_TYPE<getSettlementDataList>;

  type getHockeyEventRes = COMMON.BASE_RES_TYPE<HockeyEventData>;
  type getBoxingEventRes = COMMON.BASE_RES_TYPE<BoxingEventData>;
  type getDartsEventRes = COMMON.BASE_RES_TYPE<DartsEventData>;

  type getHandballEventRes = COMMON.BASE_RES_TYPE<HandballEvent[]>;
  type addHandballEventResType = COMMON.BASE_RES_TYPE<any>;
  type getIceHockeyEventRes = COMMON.BASE_RES_TYPE<IceHockeyEvent[]>;
  type addIceHockeyEventResType = COMMON.BASE_RES_TYPE<any>;
  type getCricketEventRes = COMMON.BASE_RES_TYPE<CricketEvent[]>;
  type addCricketEventResType = COMMON.BASE_RES_TYPE<any>;
  type getBasketballEventRes = COMMON.BASE_RES_TYPE<basketballData[]>;
  type getBadmintonEventRes = COMMON.BASE_RES_TYPE<badmintonData[]>;
  type getPingPongEventRes = COMMON.BASE_RES_TYPE<pingpongData[]>;
  type getRugbyEventRes = COMMON.BASE_RES_TYPE<rugbyData[]>;
  type getMatchEventsRes = COMMON.BASE_RES_TYPE<MatchEventsList[]>;
  type cancelBetOrderResType = COMMON.BASE_RES_TYPE<null>;

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
  type addRugbyEventReq = {
    eventTime: number | string | Date;
    matchId: number;
    inningNum: number;
    t1: number | string;
    t2: number | string;
    gameRule: string;
  };
  type SnookerEventReq = {
    eventTime: number | string;
    matchId: number;
    inningNum: number;
    t1: number | string;
    t2: number | string;
    gameRule: string;
  };
  type BadmintonEventReq = {
    eventTime: number | string | Date;
    matchId: number;
    inningNum: number;
    t1: number | string;
    t2: number | string;
    gameRule: string;
  };

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

  type newBasketballEventsList = {
    id: number;
    uuid: string;
    matchId: number;
    canceled: number;
    eventCode: string;
    eventTime: number | string;
    homeAway: string;
    matchPeriodId: number;
    t1: number | string | null;
    t2: number;
    firstNum: number;
    firstT1: number;
    firstT2: number;
    secondNum: number;
    secondT1: number;
    secondT2: number;
    sourceType: number;
    settleTimes: number;
    settleType: number;
    xjFlag: number;
    psFlag: number;
    vsFlag: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    oldEventId?: any;
    remark?: any;
    pageSize: number;
    pageNum: number;
    periodType?: number;
    isEdit?: boolean;
    isSave?: boolean;
  }

  type newBasketballEventsData = {
    total: number;
    list: newBasketballEventsList[];
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

  type newBasketballEventsResType = COMMON.BASE_RES_TYPE<newBasketballEventsData>
  type manualSettlementFullTimeResType = COMMON.BASE_RES_TYPE<null>
  type basketballCancelMatchEventResType = COMMON.BASE_RES_TYPE<null>

  type addBasketballEventV2ReqType = {
    eventTime: string | number | Date;
    matchId: number;
    matchPeriodId: string | number;
    t1: number;
    t2: number;
  }
}
