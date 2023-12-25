import { http } from "@/utils/http";

export const sattleData = {
  getMatchEvents: (data: {
    matchId: number;
  }) => http.request<SattleDataAPI.getMatchEventsRes>("post", "/event/v1/getMatchEvents", { data }),

  addMatchEvent: (data: SattleDataAPI.MatchEventParams) => http.request<MetadataAPI.TeamListRes>("post", "/event/v1/addMatchEvent", { data }),

  updateMatchEvent: (data: SattleDataAPI.MatchEventParams) => http.request<SaleDataAPI.PreSaleListRes>("post", "/event/v1/updateMatchEvent", { data }),

  firstHalfSettlement: (data: {
    matchId: number;
  }) => http.request<SaleDataAPI.PreSaleListRes>("post", "/event/v1/firstHalfSettlement", { data }),
};
