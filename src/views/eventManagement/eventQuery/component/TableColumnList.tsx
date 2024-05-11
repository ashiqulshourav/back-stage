import dayjs from 'dayjs';

export const columns: TableColumnList = [
  {
    label: t('事件源发生时间'),
    prop: 'createdAt',
    minWidth: 150,
  },
  {
    label: t('事件源'),
    prop: 'dataSourceCode',
    minWidth: 150
  },
  {
    label: t('事件名称'),
    prop: 'addition5',
    minWidth: 300
  },
  {
    label: t('场次/局数/盘数'),
    prop: 'extraInfo',
    minWidth: 150
  },
  {
    label: t('主/客'),
    prop: 'homeAway',
    minWidth: 150
  },
  {
    label: t('球员名称'),
    prop: 'player1Name',
    minWidth: 150
  },
  {
    label: t('比分'),
    slot: 'score',
    minWidth: 150
  }
];
