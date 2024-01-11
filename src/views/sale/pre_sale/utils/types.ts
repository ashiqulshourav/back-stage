
interface FormProps {
  formInline: SaleDataAPI.PreSaleList;
}

interface TeamFormProps {
  formInline: Partial<SaleDataAPI.PreSaleList>;
}

export type SearchFormType = {
  matchId: string;
  matchName: string;
  isSale: string;
  sportId: string;
  startTime: number | string;
  leagueId: string;
  leagueNameCn: string;
  endTime: string;
}

export type {
  FormProps,
  TeamFormProps
};
