import dayjs from 'dayjs';
import { handleTableWidth } from '@/utils/getTableWidth';
import { getLan } from '@/utils/utilFn';
export const columns: TableColumnList = [
  {
    label: t('盘口ID'),
    prop: 'sourceBetItemsMid'
  },
  {
    label: t('盘口名称'),
    prop: 'betItemsNameEn',
    width: 300,
    headerRenderer: d => handleTableWidth(d, t('盘口名称'), 'auto'),
    formatter: ({ betItemsNameEn, betItemsName }) =>
      betItemsNameEn ? betItemsNameEn : betItemsName
  },
  {
    label: t('盘口投注项'),
    slot: 'betOptions',
    minWidth: 200
  },
  {
    label: t('操作'),
    slot: 'operaction',
    width: getLan() === 'zh' ? 200 : 260
  },
  {
    label: t('结算状态'),
    prop: 'win',
    width: 150,
    formatter: ({ win }) => (win === null ? t('未结算') : t('已结算'))
  },
  {
    label: t('结算时间'),
    prop: 'eventTime',
    width: 220,
    formatter: ({ eventTime }) =>
      eventTime ? dayjs(eventTime).format('YYYY-MM-DD HH:mm:ss') : '-'
  }
];
