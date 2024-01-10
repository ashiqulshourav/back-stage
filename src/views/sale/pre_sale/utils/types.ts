
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
  beginTime: number | string;
  leagueId: string;
  leagueNameCn: string;
}

export type {
  FormProps,
  TeamFormProps
};
