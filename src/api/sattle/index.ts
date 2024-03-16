import { http } from '@/utils/http';

export const sattleData = {
  getSettlementList: (data: SattleDataAPI.getSettlementListPrams) =>
    http.request<SattleDataAPI.getSettlementListRes>(
      'post',
      '/match/v1/getSettlementList',
      { data }
    ),

  //- 体育结算历史
  getSettlementHistory: (data: SattleDataAPI.getSettlementHistoryParams) =>
    http.request<SattleDataAPI.getSettlementListRes>(
      'post',
      '/match/v1/getSettlementHistory',
      { data }
    ),

  getMatchEvents: (data: { matchId: number }) =>
    http.request<SattleDataAPI.getMatchEventsRes>(
      'post',
      '/event/v1/getMatchEvents',
      { data }
    ),

  getBasketballEvents: (data: { matchId: number }) =>
    http.request<SattleDataAPI.getBasketballEventRes>(
      'post',
      '/basketball/v1/getBasketballEvents',
      { data }
    ),

  getHandballEvents: (data: { matchId: number }) =>
    http.request<SattleDataAPI.getHandballEventRes>(
      'post',
      '/handball/v1/getHandballEvents',
      { data }
    ),
  getIceHockeyEvents: (data: { matchId: number }) =>
    http.request<SattleDataAPI.getHandballEventRes>(
      'post',
      '/iceHockey/v1/getIceHockeyEvents',
      { data }
    ),
  // mockAPI.getIceHockeyEvents(data),
  getCricketEvents: (data: { matchId: number }) =>
    http.request<SattleDataAPI.getCricketEventRes>(
      'post',
      '/cricket/v1/getCricketEvents',
      { data }
    ),

  getHockeyEvents: (data: { matchId: number }) =>
    http.request<SattleDataAPI.getHockeyEventRes>(
      'post',
      '/hockey/v1/getHockeyEvents',
      { data }
    ),

  getBoxingEvents: (data: { matchId: number }) =>
    http.request<SattleDataAPI.getBoxingEventRes>(
      'post',
      '/boxing/v1/getBoxingEvents',
      { data }
    ),

  getDartsEvents: (data: { matchId: number }) =>
    http.request<SattleDataAPI.getDartsEventRes>(
      'post',
      '/darts/v1/getDartsEvents',
      { data }
    ),

  addMatchEvent: (data: SattleDataAPI.MatchEventParams) =>
    http.request<MetadataAPI.TeamListRes>('post', '/event/v1/addMatchEvent', {
      data
    }),

  addBasketballEvent: (data: SattleDataAPI.MatchEventParams) =>
    http.request<MetadataAPI.AddBasketballEeventRes>(
      'post',
      '/basketball/v1/addBasketballEvent',
      { data }
    ),
  addHandballEvent: (data: SattleDataAPI.MatchEventParams) =>
    http.request<MetadataAPI.AddSportEventRes>(
      'post',
      '/handball/v1/addHandballEvent',
      { data }
    ),
  // mockAPI.addHandballEvent(data),
  //- 新增冰球事件
  addIceHockeyEvent: (data: SattleDataAPI.MatchEventParams) =>
    http.request<MetadataAPI.AddSportEventRes>(
      'post',
      '/iceHockey/v1/addIceHockeyEvent',
      { data }
    ),
  // mockAPI.addIceHockeyEvent(data),
  addCricketEvent: (data: SattleDataAPI.MatchEventParams) =>
    http.request<MetadataAPI.AddSportEventRes>(
      'post',
      '/cricket/v1/addCricketEvent',
      { data }
    ),

  allHandballSettlement: (data: { matchId: number }) =>
    http.request<MetadataAPI.AddSportEventRes>(
      'post',
      '/handball/v1/manualSettlementFullTime',
      { data }
    ),
  //- 冰球全场结算
  allIceHockeySettlement: (data: { matchId: number }) =>
    http.request<MetadataAPI.AddSportEventRes>(
      'post',
      '/iceHockey/v1/manualSettlementFullTime',
      { data }
    ),
  allCricketSettlement: (data: { matchId: number }) =>
    http.request<MetadataAPI.AddSportEventRes>(
      'post',
      '/cricket/v1/manualSettlementFullTime',
      { data }
    ),

  addHockeyEvent: (data: SattleDataAPI.MatchEventParams) =>
    http.request<MetadataAPI.AddHockeyEventRes>(
      'post',
      '/hockey/v1/addHockeyEvent',
      { data }
    ),

  addBoxingEvent: (data: SattleDataAPI.MatchEventParams) =>
    http.request<MetadataAPI.AddBoxingEventRes>(
      'post',
      '/boxing/v1/addBoxingEvent',
      { data }
    ),

  addDartsEvent: (data: SattleDataAPI.MatchEventParams) =>
    http.request<MetadataAPI.AddDartsEventRes>(
      'post',
      '/darts/v1/addDartsEvent',
      { data }
    ),

  allBasketballSettlement: (data: { matchId: number }) =>
    http.request<MetadataAPI.AddBasketballEeventRes>(
      'post',
      '/basketball/v1/manualSettlementFullTime',
      { data }
    ),

  allHockeySettlement: (data: { matchId: number }) =>
    http.request<MetadataAPI.AddHockeyEventRes>(
      'post',
      '/hockey/v1/manualSettlementFullTime',
      { data }
    ),

  allBoxingSettlement: (data: { matchId: number }) =>
    http.request<MetadataAPI.AddBoxingEventRes>(
      'post',
      '/boxing/v1/manualSettlementFullTime',
      { data }
    ),

  allDartsSettlement: (data: { matchId: number }) =>
    http.request<MetadataAPI.AddDartsEventRes>(
      'post',
      '/darts/v1/manualSettlementFullTime',
      { data }
    ),

  updateMatchEvent: (data: SattleDataAPI.MatchEventParams) =>
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
  cancelMatchEvent: (data: SattleDataAPI.cancelMatchEventParams) =>
    http.request<SaleDataAPI.cancelMatchEventResType>(
      'post',
      '/event/v1/cancelMatchEvent',
      { data }
    ),

  //-网球结算赛事列表
  getTennisEvents: (data: { matchId: number }) =>
    http.request<SattleDataAPI.getTennisEventsResType>(
      'post',
      '/tennis/v2/getTennisEvents',
      { data }
    ),

  //-网球新增事件（按盘）
  addTennisEvent: (data: SattleDataAPI.addTennisEventReq) =>
    http.request<SattleDataAPI.addTennisEventResType>(
      'post',
      '/tennis/v2/addTennisEvent',
      { data }
    ),

  //-网球重新结算（按盘）
  TennisReSettleMatchEvent: (data: SattleDataAPI.addTennisEventReq) =>
    http.request<SattleDataAPI.addTennisEventResType>(
      'post',
      '/tennis/v2/reSettleMatchEvent',
      { data }
    ),
  //-斯诺克新增事件（按局）
  addSnookerEvent: (data: SattleDataAPI.SnookerEventReq) =>
    http.request<SattleDataAPI.addTennisEventResType>(
      'post',
      '/snooker/v1/addSnookerEvent',
      { data }
    ),

  //-排球新增事件（按局）
  addVolleyballEvent: (data: SattleDataAPI.VolleyballReq) =>
    http.request<SattleDataAPI.addTennisEventResType>(
      'post',
      '/volleyball/v1/addVolleyballEvent',
      { data }
    ),
  addRugbyEvent: (data: SattleDataAPI.addRugbyEventReq) =>
    http.request<SattleDataAPI.addRugbyEventResType>(
      'post',
      '/rugby/v1/addRugbyEvent',
      { data }
    ),
  addBadmintonballEvent: (data: SattleDataAPI.BadmintonEventReq) =>
    http.request<SattleDataAPI.addBadmintonEventResType>(
      'post',
      '/badminton/v1/addBadmintonEvent',
      { data }
    ),
  addPingPongballEvent: (data: SattleDataAPI.BadmintonEventReq) =>
    http.request<SattleDataAPI.addBadmintonEventResType>(
      'post',
      '/pingPong/v1/addPingPongEvent',
      { data }
    ),

  //-斯诺克结算事件列表
  getSnookerEvents: (data: { matchId: number }) =>
    http.request<SattleDataAPI.getSnookerEventsResType>(
      'post',
      '/snooker/v1/getSnookerEvents',
      { data }
    ),

  //-排球结算事件列表
  getVolleyballEvents: (data: { matchId: number }) =>
    http.request<SattleDataAPI.getVolleyballEventsResType>(
      'post',
      '/volleyball/v1/getVolleyballEvents',
      { data }
    ),

  //- 排球结算管理重新结算
  volleyballReSettleMatchEvent: (data: SattleDataAPI.VolleyballReq) =>
    http.request<SattleDataAPI.volleyReSettleMatchEventResType>(
      'post',
      '/volleyball/v1/reSettleMatchEvent',
      { data }
    ),
  //- 手球结算管理重新结算
  handballReSettleMatchEvent: (data: SattleDataAPI.VolleyballReq) =>
    http.request<SattleDataAPI.volleyReSettleMatchEventResType>(
      'post',
      '/handball/v1/reSettleMatchEvent',
      { data }
    ),

  //- 冰球结算管理重新结算
  iceHockeyReSettleMatchEvent: (data: SattleDataAPI.VolleyballReq) =>
    http.request<SattleDataAPI.volleyReSettleMatchEventResType>(
      'post',
      '/iceHockey/v1/reSettleMatchEvent',
      { data }
    ),

  getBadmintonEvents: (data: { matchId: number }) =>
    http.request<SattleDataAPI.getBadmintonEventRes>(
      'post',
      '/badminton/v1/getBadmintonEvents',
      { data }
    ),
  getPingpongEvents: (data: { matchId: number }) =>
    http.request<SattleDataAPI.getPingPongEventRes>(
      'post',
      '/pingPong/v1/getPingPongEvents',
      { data }
    ),
  getRugbyEvents: (data: { matchId: number }) =>
    http.request<SattleDataAPI.getRugbyEventRes>(
      'post',
      '/rugby/v1/getRugbyEvents',
      { data }
    ),

  //-网球全场结算（按盘）
  manualSettlementFullTime: (data: { matchId: number, t1: number; t2: number; }) =>
    http.request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/tennis/v2/manualSettlementFullTime',
      { data }
    ),

  //-排球全场结算（按盘）
  volleyballManualSettlementFullTime: (data: { matchId: number }) =>
    http.request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/volleyball/v1/manualSettlementFullTime',
      { data }
    ),

  //-斯诺克全场结算（按盘）
  snookerManualSettlementFullTime: (data: { matchId: number }) =>
    http.request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/snooker/v1/manualSettlementFullTime',
      { data }
    ),
  BamintonManualSettlementFullTime: (data: { matchId: number }) =>
    http.request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/badminton/v1/manualSettlementFullTime',
      { data }
    ),
  PingPongManualSettlementFullTime: (data: { matchId: number }) =>
    http.request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/pingPong/v1/manualSettlementFullTime',
      { data }
    ),
  RugbyManualSettlementFullTime: (data: { matchId: number }) =>
    http.request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/rugby/v1/manualSettlementFullTime',
      { data }
    ),
  //- 获取单个赛事信息
  getPreSaleInfo: (data: { matchId: number }) =>
    http.request<SattleDataAPI.preSaleInfoResType>(
      'post',
      '/match/v1/getPreSaleInfo',
      { data }
    ),

  //- 取消赛事
  cancelBetOrder: (data: {
    matchId: number;
    remark: string;
    sportName: string;
  }) =>
    http.request<SattleDataAPI.cancelBetOrderResType>(
      'post',
      '/match/v1/cancelMatchOrder',
      { data }
    ),

  /* 
  * 篮球结算新版接口
   */
  getNewBasketballEvents: (data: { matchId: number }) => http.request<SattleDataAPI.newBasketballEventsResType>(
    'post', '/basketball/v2/getBasketballEvents', { data }),

  //- 篮球手动新增事件
  addBasketballEventV2: (data: SattleDataAPI.addBasketballEventV2ReqType) => http.request<SattleDataAPI.newBasketballEventsResType>(
    'post', '/basketball/v2/addBasketballEventV2', { data }),
  //- 篮球全场结算
  v2ManualSettlementFullTime: (data: {
    matchId: number;
  }) => http.request<SattleDataAPI.manualSettlementFullTimeResType>(
    'post', '/basketball/v2/manualSettlementFullTime', { data }),

  //- 篮球针对事件重新结算
  reSettleMatchEvent: (data: {
    matchId: number;
    id: number;
    matchPeriodId: number;
    t1: number | string;
    t2: number | string;
  }) => http.request<SattleDataAPI.basketballCancelMatchEventResType>(
    'post', '/basketball/v1/reSettleMatchEvent', { data }),

  //- 篮球取消结算事件
  basketBallCancelMatchEvent: (data: {
    id: number;
    matchId: number;
  }) => http.request<SattleDataAPI.basketballCancelMatchEventResType>(
    'post', '/basketball/v1/cancelMatchEvent', { data }),

  //- 足球开启二次结算
  open2ndSettlementStatus: (data: {
    matchId: number;
  }) => http.request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/event/v1/open2ndSettlementStatus', { data }),

  //- 网球开启二次结算
  tenantOpen2ndSettlementStatus: (data: {
    matchId: number;
  }) => http.request<SattleDataAPI.tenantOpen2ndSettlementStatusResType>(
    'post', '/event/v1/open2ndSettlementStatus', { data }),

  //- 足球确认二次结算
  confirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => http.request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/event/v1/confirm2ndSettlement', { data }),

  //- 网球确认二次结算
  tenantConfirm2ndSettlement: (data: SattleDataAPI.tenantConfirm2ndSettlementReqType) => http.request<SattleDataAPI.tenantConfirm2ndSettlementResType>(
    'post', '/tennis/v1/confirm2ndSettlement', { data }),

  //- 篮球开启二次结算
  basketballOpen2ndSettlementStatus: (data: {
    matchId: number;
  }) => http.request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/basketball/v1/open2ndSettlementStatus', { data }),
  //- 排球开启二次结算
  volleyballOpen2ndSettlementStatus: (data: {
    matchId: number;
  }) => http.request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/volleyball/v1/open2ndSettlementStatus', { data }),

  //- 手球开启二次结算
  handballOpen2ndSettlementStatus: (data: {
    matchId: number;
  }) => http.request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/handball/v1/open2ndSettlementStatus', { data }),

  //- 冰球开启二次结算
  iceHockeyOpen2ndSettlementStatus: (data: {
    matchId: number;
  }) => http.request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/iceHockey/v1/open2ndSettlementStatus', { data }),

  //- 篮球确认二次结算
  basketballConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => http.request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/basketball/v1/confirm2ndSettlement', { data }),

  //- 排球确认二次结算
  volleyballConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => http.request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/volleyball/v1/confirm2ndSettlement', { data }),

  //- 手球确认重新结算
  handballConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => http.request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/handball/v1/confirm2ndSettlement', { data }),

  //- 冰球确认重新结算
  iceHockeyConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => http.request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/iceHockey/v1/confirm2ndSettlement', { data }),

};
