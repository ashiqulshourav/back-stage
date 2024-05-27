

export type searchFormType = {
  pageSize?: number | string;
  pageNum?: number | string;
  sportId: string;
  userIdOrName: string;
  timeStart?: number | string;
  timeEnd?: number | string;
  orderId: string;
  leagueId: string;
  matchId: string;
  awayTeamName?: string;
  homeTeamName?: string;
  seriesType: number | string;
  // status:any;
  isInplay?: number | string;
  category: string | number;
  [key: string]: any;
  timeType?: number;
  leagueName: string;
  tenantIds: any;
  queryType: number;
  minBetAmount: number | string;
  maxBetAmount: number | string;
  minProfitAmount: number | string;
  maxProfitAmount: number | string;
  betItemId: number | string;
  riskControlLabelList: number[],
  venueType: number;
  riskStatus:number|string;
}


export enum betStatus {
  all = 1,
  PendingApprove = 2,
  unsettlementBet = 3,
  settlementBet = 4,
  betInvalid = 6,
  eventAbnormal = 8,
  reserveFail = 10,
  onReverse = 11,
  reverseCancel = 12
}
export const betStatusMap = {
  [betStatus.all]: t('全部'),
  [betStatus.PendingApprove]: t('待审核'),
  [betStatus.unsettlementBet]: t('未结算'),
  [betStatus.settlementBet]: t('已结算'),
  [betStatus.PendingApprove]: t('待审核'),
  [betStatus.betInvalid]: t('注单无效'),
  [betStatus.eventAbnormal]: t('赛事异常'),
  [betStatus.reserveFail]: t('预约失败'),
  [betStatus.onReverse]: t('预约中'),
  [betStatus.reverseCancel]: t('预约取消')
}

export enum riskStatus{
  unRisk = 0,
  waitingApprove = 2,
  autoApprove=103,
  handelApprove=104,
  autoReject = 203,
  handleReject = 204,
}
export const riskStatusMap = {
  [riskStatus.unRisk]: t('未风控'),
  [riskStatus.waitingApprove]: t('待审核'),
  [riskStatus.autoApprove]: t('自动审核通过'),
  [riskStatus.handelApprove]: t('手动审核通过'),
  [riskStatus.autoReject]: t('自动划单'),
  [riskStatus.handleReject]: t('手动划单'),
}



export const seriesTypesSingle = {
  '2001': { value: '2001', name: '2串1', list: [2001] },
  '3001': { value: '3001', name: '3串1', list: [3001] },
  '4001': { value: '4001', name: '4串1', list: [4001] },
  '5001': { value: '5001', name: '5串1', list: [5001] },
  '6001': { value: '6001', name: '6串1', list: [6001] },
  '7001': { value: '7001', name: '7串1', list: [7001] },
  '8001': { value: '8001', name: '8串1', list: [8001] },
  '9001': { value: '9001', name: '9串1', list: [9001] },
  '10001': { value: '10001', name: '10串1', list: [10001] },
}
export const seriesTypesDuplex = {
  '2001': { value: '2001', name: '2串1 ', list: [2003, 2006, 20010, 20015, 20021, 20028, 20036, 20045] },
  '3001': { value: '3001', name: '3串1 ', list: [3004, 30010, 30020, 30035, 30056, 30084, 300120] },
  '4001': { value: '4001', name: '4串1', list: [4005, 40015, 40035, 40070, 400126, 400210] },
  '5001': { value: '5001', name: '5串1', list: [5006, 50021, 50056, 500126, 500252] },
  '6001': { value: '6001', name: '6串1', list: [6007, 60028, 60084, 600210] },
  '7001': { value: '7001', name: '7串1', list: [7008, 70036, 700120] },
  '8001': { value: '8001', name: '8串1', list: [8009, 80045] },
  '9001': { value: '9001', name: '9串1', list: [90010] },
  '3004': { value: '3004', name: '3串4', list: [3004] },
  '40011': { value: '40011', name: '4串11', list: [40011] },
  '50026': { value: '50026', name: '5串26', list: [50026] },
  '60057': { value: '60057', name: '6串57', list: [60057] },
  '700120': { value: '700120', name: '7串120', list: [700120] },
  '800247': { value: '800247', name: '8串247', list: [800247] },
  '900502': { value: '900502', name: '9串502', list: [900502] },
  '10001013': { value: '10001013', name: '10串1013', list: [10001013] },
}
