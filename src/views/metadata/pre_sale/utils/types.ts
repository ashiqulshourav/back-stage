
interface FormProps {
  formInline: SaleDataAPI.PreSaleList;
}

interface TeamFormProps {
  formInline: Partial<SaleDataAPI.PreSaleList>;
}

/* 
 是否属于赛制集合中的赛制 1-属于 0-不属于
 */

export type SearchFormType = {
  matchId: string;
  matchName: string;
  isSale: string;
  sportId: string | number;
  startTime: number | string;
  leagueId: string;
  leagueNameCn: string;
  endTime: string;
  handicapStatus: number | string;
  category: number | string;
  overTimeAndPenaltyKickStatus: boolean | null;
  periodTypeList: number[]; //- 赛制集合
  partOfPeriod: number | string; //- 1-属于 0-不属于
}

export type {
  FormProps,
  TeamFormProps
};
