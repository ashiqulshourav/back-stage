
interface FormProps {
  formInline: SaleDataAPI.PreSaleList;
}

interface TeamFormProps {
  formInline: Partial<SaleDataAPI.PreSaleList>;
}

export type SearchFormType = {
  matchId: string;
  matchName: string;
  gameName: string;
  isSale: string;
  sportId: string;
  startTime: number | string;
  leagueId: string;
  leagueNameCn: string;
  endTime: string;
  handicapStatus: number | string;
}

export type EsportMatchRowType = {
  index?: number;
  row: EsportsSettlementAPI.ESportMatchList;
}

export type {
  FormProps,
  TeamFormProps
};
