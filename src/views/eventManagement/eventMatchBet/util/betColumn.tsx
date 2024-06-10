export const columns: TableColumnList = [
  {
    label: t('序号'),
    type: 'index'
  },
  {
    label: t('赛事ID'),
    prop: 'countryId'
  },
  {
    label: t('188数据源联赛ID'),
    prop: 'leagueId188Bet'
  },
  {
    label: t('联赛LOGO'),
    slot: 'leagueLogo'
  }
];
