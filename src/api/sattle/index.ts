import { http } from "@/utils/http";

export const sattleData = {
  getMatchEvents: (data: {
    matchId: number;
  }) => http.request<SattleDataAPI.getMatchEventsRes>("post", "/event/v1/getMatchEvents", { data }),

  addMatchEvent: (data: {
    addMatchEvent: number;
    eventCode: string;
    eventTime: Date;
    homeAway: string;
    matchId: number;
    matchPeriodId: number;
    player1Name: string;
    remark: string;
    sourceType: number;
    sportId: number;
    t1: number;
    t2: number;
  }) => http.request<MetadataAPI.TeamListRes>("post", "/event/v1/addMatchEvent", { data }),

  getMorningSets: (data: {
    matchId?: number;
    matchName?: number;
    isSale?: number;
    beginTime?: string;
    pageNum?: number;
    pageSize?: number;
  }) => http.request<SaleDataAPI.PreSaleListRes>("post", "/match/v1/getMorningSets", { data }),

  getRollingBall: (data: {
    matchId?: number;
    matchName?: number;
    isSale?: number;
    beginTime?: string;
    pageNum?: number;
    pageSize?: number;
  }) => http.request<SaleDataAPI.PreSaleListRes>("post", "/match/v1/getRollingBall", { data }),
};
