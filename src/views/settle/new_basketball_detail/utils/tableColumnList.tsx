import dayjs from 'dayjs';
import { handleTableWidth } from '@/utils/getTableWidth';

export const childColumns: TableColumnList = [
  {
    label: t('主队 : 客队'),
    prop: 't1',
    formatter: ({ t1, t2 }) => {
      return `${t1 ?? '-'} : ${t2 ?? '-'}`;
    }
  },
  {
    label: t('事件编码'),
    slot: 'eventCode'
  },
  {
    label: t('结算类型'),
    slot: 'settleType'
  },
  {
    label: t('比赛进行时间'),
    slot: 'eventTime',
    headerRenderer: d => handleTableWidth(d, t('比赛进行时间'))
  },
  {
    label: t('比赛阶段'),
    slot: 'matchPeriodId'
  },
  {
    label: t('事件来源'),
    slot: 'homeAway'
  },
  {
    label: t('操作'),
    slot: 'operation'
  },
  {
    label: t('结算次数'),
    prop: 'settleTimes',
    formatter: ({ settleTimes }) => settleTimes ?? '-'
  },
  {
    label: t('确认时间'),
    prop: 'updatedAt',
    formatter: ({ updatedAt, settleTimes }) =>
      settleTimes > 0 ? dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'
  },
  {
    label: t('数据商'),
    slot: 'dataSourceCode'
  }
];
