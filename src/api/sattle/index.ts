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

  addMatchEvent: (data: SattleDataAPI.MatchEventParams) => http.request<MetadataAPI.TeamListRes>("post", "/event/v1/addMatchEvent", { data }),

  updateMatchEvent: (data: SattleDataAPI.MatchEventParams) => http.request<SaleDataAPI.PreSaleListRes>("post", "/event/v1/updateMatchEvent", { data }),

  deleteMatchEvent: (data: { id: number }) => http.request<SaleDataAPI.deleteMatchEventRes>("post", "/event/v1/deleteMatchEvent", { data }),

  firstHalfSettlement: (data: {
    matchId: number;
  }) => http.request<SaleDataAPI.allSettlementRes>("post", "/event/v1/firstHalfSettlement", { data }),

  allSettlement: (data: {
    matchId: number;
  }) => http.request<SaleDataAPI.allSettlementRes>("post", "/event/v1/allSettlement", { data }),

  //- 足球结算自动结算转手动结算
  setManualMatchStatus: (data: {
    matchId: number;
  }) => http.request<SaleDataAPI.setManualMatchStatusResType>("post", "/event/v1/setManualMatchStatus", { data }),

  //- 足球结算取消事件
  cancelMatchEvent: (data: {
    id: number;
    matchId: number;
    remark: string;
  }) => http.request<SaleDataAPI.cancelMatchEventResType>("post", "/event/v1/cancelMatchEvent", { data }),

  //-网球结算赛事列表
  getTennisEvents: (data: {
    matchId: number;
  }) => http.request<SattleDataAPI.getTennisEventsResType>("post", "/tennis/v1/getTennisEvents", { data }),

  //-网球新增事件（按盘）
  addTennisEvent: (data:
    SattleDataAPI.addTennisEventReq
  ) => http.request<SattleDataAPI.addTennisEventResType>("post", "/tennis/v1/addTennisEvent", { data }),

  //-网球新增事件（按盘）
  manualSettlementFullTime: (data:
    { matchId: number }
  ) => http.request<SattleDataAPI.manualSettlementFullTimeRestType>("post", "/tennis/v1/manualSettlementFullTime", { data }),

  //- 获取单个赛事信息
  getPreSaleInfo: (data:
    { matchId: number }
  ) => http.request<SattleDataAPI.preSaleInfoResType>("post", "/match/v1/getPreSaleInfo", { data }),
};
