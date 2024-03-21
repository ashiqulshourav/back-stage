
export type searchFormType = {
  pageSize?:number|string;
  pageNum?:number|string;
  sportId: string;
  userIdOrName: string;
  timeStart: number | string;
  timeEnd: number | string;
  orderId: string;
  leagueId: string;
  matchId: string;
  awayTeamNameCn: string;
  homeTeamNameCn: string;
  seriesType:number|string;
  status:any;
  isInplay:number|string;
  category:string|number;
  [key: string]: any;
  timeType:number
}

export enum betStatus {
  all = 1,
  confirm = 2,
  unsettlementBet = 3,
  settlementBet = 4,
  PendingApprove = 5,
  betInvalid = 6,
  betFail = 7,
  eventAbnormal = 8,
  reserveFail = 9,
}
export const betStatusMap ={
  [betStatus.all]: t('全部'),
  [betStatus.confirm]: t('确认中'),
  [betStatus.unsettlementBet]: '未结算',
  [betStatus.settlementBet]: t('已结算'),
  [betStatus.PendingApprove]: t('待审核'),
  [betStatus.betInvalid]: t('注单无效'),
  [betStatus.betFail]: t('投注失败'),
  [betStatus.eventAbnormal]: t('赛事异常'),
  [betStatus.reserveFail]: t('预约失败'),
}


