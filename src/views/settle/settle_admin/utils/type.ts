
export type FormProps = {
  matchId?: string | number;
  matchType?: string;
  matchName: string;
  halfSettlementStatus: number | string;
  fullSettlementStatus: number | string;
  dataVendors?: string;
  [key: string]: any;
}
