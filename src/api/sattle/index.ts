import { http } from "@/utils/http";

export const sattleData = {
  getSettlementList: (data: {
    isSale?: number;
    leagueId?: number;
    pageNum: number;
    pageSize: number;
    sportId?: number;
    startTime?: number;
    endTime?: number;
  }) => http.request<SattleDataAPI.getSettlementListRes>("post", "/match/v1/getSettlementList", { data }),

  getSettlementHistory: (data: {
    isSale?: number;
    leagueId?: number;
    pageNum: number;
    pageSize: number;
    sportId?: number;
    startTime?: number;
    endTime?: number;
  }) => http.request<SattleDataAPI.getSettlementListRes>("post", "/match/v1/getSettlementHistory", { data }),

  getMatchEvents: (data: {
    matchId: number;
  }) => http.request<SattleDataAPI.getMatchEventsRes>("post", "/event/v1/getMatchEvents", { data }),

  addMatchEvent: (data: SattleDataAPI.MatchEventParams) => http.request<MetadataAPI.TeamListRes>("post", "/event/v1/addMatchEvent", { data }),

  updateMatchEvent: (data: SattleDataAPI.MatchEventParams) => http.request<SaleDataAPI.PreSaleListRes>("post", "/event/v1/updateMatchEvent", { data }),

  deleteMatchEvent: (data: { id: number }) => http.request<SaleDataAPI.deleteMatchEventRes>("post", "/event/v1/deleteMatchEvent", { data }),

  firstHalfSettlement: (data: {
    matchId: number;
  }) => http.request<SaleDataAPI.allSettlementRes>("post", "/event/v1/firstHalfSettlement", { data }),

  allSettlement: (data: {
    matchId: number;
  }) => http.request<SaleDataAPI.allSettlementRes>("post", "/event/v1/allSettlement", { data }),
};
