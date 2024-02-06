import { http } from "@/utils/http";

export const sattleData = {
  getSettlementList: (data: {
    isSale?: number;
    leagueId?: number;
    pageNum?: number;
    pageSize?: number;
    sportId?: number;
    startTime?: number;
    matchId?: number;
    endTime?: number;
  }) => http.request<SattleDataAPI.getSettlementListRes>("post", "/match/v1/getSettlementList", { data }),

  //- 体育结算历史
  getSettlementHistory: (data: {
    isSale?: number;
    leagueId?: number;
    pageNum: number;
    pageSize: number;
    sportId?: number;
    status?: number;
    startTime?: number;
    endTime?: number;
  }) => http.request<SattleDataAPI.getSettlementListRes>("post", "/match/v1/getSettlementHistory", { data }),

  getMatchEvents: (data: {
    matchId: number;
  }) => http.request<SattleDataAPI.getMatchEventsRes>("post", "/event/v1/getMatchEvents", { data }),
  getBasketballEvents: (data: {
    matchId: number;
  }) => http.request<SattleDataAPI.getBasketballEventRes>("post", "/basketball/v1/getBasketballEvents", { data }),
  addMatchEvent: (data: SattleDataAPI.MatchEventParams) => http.request<MetadataAPI.TeamListRes>("post", "/event/v1/addMatchEvent", { data }),
  addBasketballEvent: (data: SattleDataAPI.MatchEventParams) => http.request<MetadataAPI.AddBasketballEeventRes>("post", "/basketball/v1/addBasketballEvent", { data }),

  updateMatchEvent: (data: SattleDataAPI.MatchEventParams) => http.request<SaleDataAPI.PreSaleListRes>("post", "/event/v1/updateMatchEvent", { data }),

  deleteMatchEvent: (data: { id: number }) => http.request<SaleDataAPI.deleteMatchEventRes>("post", "/event/v1/deleteMatchEvent", { data }),

  firstHalfSettlement: (data: {
    matchId: number;
  }) => http.request<SaleDataAPI.allSettlementRes>("post", "/event/v1/firstHalfSettlement", { data }),

  allSettlement: (data: {
    matchId: number;
  }) => http.request<SaleDataAPI.allSettlementRes>("post", "/event/v1/allSettlement", { data }),

  //- 自动结算转手动结算
  setManualMatchStatus: (data: {
    matchId: number;
  }) => http.request<SaleDataAPI.setManualMatchStatusResType>("post", "/event/v1/setManualMatchStatus", { data }),

  //- 取消事件
  cancelMatchEvent: (data: {
    id: number;
    matchId: number;
  }) => http.request<SaleDataAPI.cancelMatchEventResType>("post", "/event/v1/cancelMatchEvent", { data }),
};
