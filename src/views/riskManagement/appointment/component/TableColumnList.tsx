import dayjs from 'dayjs';

export const columns: TableColumnList = [
  {
    label: t('联赛等级'),
    prop: 'leagueLevel',
    minWidth: 100
  },
  {
    label: t('联赛数量'),
    prop: 'leagueCount',
    minWidth: 150
  },
  {
    label: t('预约开关'),
    slot: 'reservationSwitch',
    minWidth: 150
  },
  {
    label: t('操作人'),
    minWidth: 150,
    prop: 'updatedBy'
  },
  {
    label: t('最近操作时间'),
    prop: 'updatedAt',
    formatter: ({ updatedAt }) =>
      dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    minWidth: 150
  }
];
