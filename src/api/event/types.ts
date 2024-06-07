declare namespace EventAPI {
  type PandaMatchEventListParams = {
    matchId?: number | string;
    dataSourceCode?: string | number;
    eventCode?: [];
    startTime?: number | string;
    endTime?: number | string;
    pageSize?: number;
    pageNum?: number;
  };

  type MatchInfo = {
    aTeamName: string;
    hTeamName: string;
    league: string;
    matchId: string;
    sportName: string;
    startDateTime: string;
  };

  type MatchInfoRes = {
    code: number;
    ts: number;
    msg: string;
    data: MatchInfo;
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

  type EventData = {
    type: string;
    n: number;
  }

  type Event = {
    away: EventData[];
    home: EventData[];
  }

  type getMatchStatusticData = {
    beginTime: string;
    homeTeamNameCn: string;
    awayTeamNameCn: string;
    homeTeamLogo: string;
    awayTeamLogo: string;
    bet: number[];
    event: Event[];
  }



  type getMatchStatusticResType = COMMON.BASE_RES_TYPE<getMatchStatusticData>
}