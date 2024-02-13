import { http } from '@/utils/http';

export const sattleData = {
  getSettlementList: (data: SettleDataAPI.getSettlementListPrams) =>
    http.request<SettleDataAPI.getSettlementListRes>(
      'post',
      '/match/v1/getSettlementList',
      { data }
    ),

  //- 体育结算历史
  getSettlementHistory: (data: SettleDataAPI.getSettlementHistoryParams) =>
    http.request<SettleDataAPI.getSettlementListRes>(
      'post',
      '/match/v1/getSettlementHistory',
      { data }
    ),

  getMatchEvents: (data: { matchId: number }) =>
    http.request<SettleDataAPI.getMatchEventsRes>(
      'post',
      '/event/v1/getMatchEvents',
      { data }
    ),

  getBasketballEvents: (data: { matchId: number }) =>
    http.request<SettleDataAPI.getBasketballEventRes>(
      'post',
      '/basketball/v1/getBasketballEvents',
      { data }
    ),

  addMatchEvent: (data: SettleDataAPI.MatchEventParams) =>
    http.request<MetadataAPI.TeamListRes>('post', '/event/v1/addMatchEvent', {
      data
    }),

  addBasketballEvent: (data: SettleDataAPI.MatchEventParams) =>
    http.request<MetadataAPI.AddBasketballEeventRes>(
      'post',
      '/basketball/v1/addBasketballEvent',
      { data }
    ),

  allBasketballSettlement: (data: { matchId: number }) =>
    http.request<MetadataAPI.AddBasketballEeventRes>(
      'post',
      '/basketball/v1/manualSettlementFullTime',
      { data }
    ),

  updateMatchEvent: (data: SettleDataAPI.MatchEventParams) =>
    http.request<SaleDataAPI.PreSaleListRes>(
      'post',
      '/event/v1/updateMatchEvent',
      { data }
    ),

  deleteMatchEvent: (data: { id: number }) =>
    http.request<SaleDataAPI.deleteMatchEventRes>(
      'post',
      '/event/v1/deleteMatchEvent',
      { data }
    ),

  firstHalfSettlement: (data: { matchId: number }) =>
    http.request<SaleDataAPI.allSettlementRes>(
      'post',
      '/event/v1/firstHalfSettlement',
      { data }
    ),

  allSettlement: (data: { matchId: number }) =>
    http.request<SaleDataAPI.allSettlementRes>(
      'post',
      '/event/v1/allSettlement',
      { data }
    ),

  //- 足球结算自动结算转手动结算
  setManualMatchStatus: (data: { matchId: number }) =>
    http.request<SaleDataAPI.setManualMatchStatusResType>(
      'post',
      '/event/v1/setManualMatchStatus',
      { data }
    ),

  //- 足球结算取消事件
  cancelMatchEvent: (data: SettleDataAPI.cancelMatchEventParams) =>
    http.request<SaleDataAPI.cancelMatchEventResType>(
      'post',
      '/event/v1/cancelMatchEvent',
      { data }
    ),

  //-网球结算赛事列表
  getTennisEvents: (data: { matchId: number }) =>
    http.request<SettleDataAPI.getTennisEventsResType>(
      'post',
      '/tennis/v1/getTennisEvents',
      { data }
    ),

  //-网球新增事件（按盘）
  addTennisEvent: (data: SettleDataAPI.addTennisEventReq) =>
    http.request<SettleDataAPI.addTennisEventResType>(
      'post',
      '/tennis/v1/addTennisEvent',
      { data }
    ),

  //-网球新增事件（按盘）
  manualSettlementFullTime: (data: { matchId: number }) =>
    http.request<SettleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/tennis/v1/manualSettlementFullTime',
      { data }
    ),

  //- 获取单个赛事信息
  getPreSaleInfo: (data: { matchId: number }) =>
    http.request<SettleDataAPI.preSaleInfoResType>(
      'post',
      '/match/v1/getPreSaleInfo',
      { data }
    )
};
