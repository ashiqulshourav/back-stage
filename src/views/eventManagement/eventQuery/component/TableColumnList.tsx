import dayjs from 'dayjs';

export const columns: TableColumnList = [
  {
    label: t('赛种'),
    prop: 'sportName',
    minWidth: 150
  },
  {
    label: t('联赛名称'),
    prop: 'league',
    minWidth: 150
  },
  {
    label: t('比赛对阵'),
    slot: 'match_vs',
    minWidth: 300
  },
  {
    label: t('赛事id'),
    prop: 'matchId',
    minWidth: 150
  },
  {
    label: t('开赛时间'),
    prop: 'startDateTime',
    minWidth: 150,
    formatter: ({ beginTimeLong }) =>
      dayjs(beginTimeLong).format('YYYY-MM-DD HH:mm:ss') || ''
  }
];
