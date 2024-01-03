
export type FormProps = {
  matchId?: string | number;
  matchType?: string;
  matchName: string;
  halfSettlementStatus: number | string;
  fullSettlementStatus: number | string;
  dataVendors?: string;
  [key: string]: any;
}

export type TempListType = {
  eventTime: null,
  homeAway: null,
  matchPeriodId: null,
  player1Name: null,
  isBackEndReturnData: false,
  t1: null,
  t2: null,
  eventCode: 'goal' | 'yellow_red_card' | 'corner'
  redOrYellow?: number;
}

export enum MatchEventType {
  Goal = 'goal',
  YellowRedCard = 'yellow_red_card',
  Corner = 'corner',
}
