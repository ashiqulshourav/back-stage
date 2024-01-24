export const columns: TableColumnList = [
  {
    label: t('盘口ID'),
    prop: 'matchId'
  },
  {
    label: t('盘口名称'),
    prop: 'matchName',
    minWidth: 200
  },
  {
    label: t('所属局数'),
    prop: 'level'
  },
  {
    label: t('盘口投注项'),
    prop: 'beginTimeLong',
    minWidth: 200
  },
  {
    label: t('操作'),
    prop: 'homeTeamId'
  },
  {
    label: t('盘口状态'),
    prop: 'currentScore',
    formatter: ({ currentScore }) =>
      currentScore.replace(/H(\d+)A(\d+)/, '$1 - $2')
  },
  {
    label: t('结算时间'),
    prop: 'awayTeamId',
    minWidth: 150
  }
];
