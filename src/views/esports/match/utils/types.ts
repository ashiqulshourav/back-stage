
interface FormProps {
  formInline: {
    leagueId: string;
    leagueNameCn: string;
    leagueNameEn: string;
    leagueName: string;
    dataSource: string;
    dataSourceName: string;
    sort: number;
  };
}

export type SearchFormType = {
  leagueNameCn: string;
  leagueNameEn: string;
  level: string;
  countryId: string;
  leagueId: string;
  leagueId188Bet: string;
  sportId: string;
}

export type { FormProps };
