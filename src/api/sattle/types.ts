declare namespace SattleDataAPI {
  type MatchEventsList = {
    canceled?: number;
    dataSourceCode?: string;
    eventCode?: string;
    eventTime?: number;
    extraInfo?: string;
    homeAway?: string;
    id?: number;
    matchId?: number;
    matchPeriodId?: number;
    matchType?: number;
    player1Id?: number;
    player1Name?: string;
    player2Name?: string;
    remark?: string;
    player2Id?: number;
    sourceType?: number;
    sportId?: number;
    t1?: number;
    t2?: number;

  }

  type getMatchEventsRes = {
    code: number;
    msg: string;
    data: MatchEventsList[];
  }

}