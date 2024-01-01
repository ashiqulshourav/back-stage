declare namespace SattleDataAPI {
  type MatchEventsList = {
    canceled?: number | boolean;
    dataSourceCode?: string;
    eventCode?: string;
    eventTime?: number | string | Date;
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
    isBackEndReturnData: boolean;
  }

  type getMatchEventsRes = {
    code: number;
    msg: string;
    data: MatchEventsList[];
  }

  type MatchEventParams = {
    canceled: number;
    eventCode: string;
    eventTime: Date;
    homeAway: string;
    matchId: number;
    matchPeriodId: number;
    player1Name: string;
    remark: string;
    sourceType: number;
    sportId: number;
    dataSourceCode?: string;
    t1: number;
    t2: number;
    id?: number;
  }

}