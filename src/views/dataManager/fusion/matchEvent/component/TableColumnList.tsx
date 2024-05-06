export const columns: TableColumnList = [
  {
    label: t('赛种'),
    prop: 'sportId',
    minWidth: 100,
  },
  {
    label: t('赛事ID'),
    slot: 'matchId',
    minWidth: 120,
  },
  {
    label: t('联赛'),
    prop: 'league',
    minWidth: 150,
  },
  {
    label: t('主队'),
    prop: 'homeTeamNameCn',
    minWidth: 150,
  },
  {
    label: t('客队'),
    prop: 'awayTeamNameCn',
    minWidth: 150,
  },
  {
    label: t('比赛开始时间'),
    prop: 'startTime',
    minWidth: 150,
  },
  {
    label: t('数据源'),
    prop: 'dataSource',
    minWidth: 150,
  },
  {
    label: t('匹配方式'),
    prop: 'matchMethod',
    minWidth: 150,
  },
  {
    label: t('操作人'),
    prop: 'createdBy',
    minWidth: 150,
  },
  {
    label: t('操作时间'),
    prop: 'createdDate',
    minWidth: 150,
  },
  {
    label: t('操作'),
    fixed: 'right',
    width: 150,
    slot: 'operation',
  }
];
