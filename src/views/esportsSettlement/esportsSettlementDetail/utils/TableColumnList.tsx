import dayjs from 'dayjs';
import { NAV_TITLE_NAME } from './map';
import { handleTableWidth } from '@/utils/getTableWidth';

export const columns: TableColumnList = [
  {
    label: t('盘口ID'),
    prop: 'sourceBetItemsMid'
  },
  {
    label: t('盘口名称'),
    prop: 'betItemsNameEn',
    minWidth: 300,
    headerRenderer: d => handleTableWidth(d, t('盘口名称'), 'auto'),
    formatter: ({ betItemsNameEn, betItemsName }) =>
      betItemsNameEn ? betItemsNameEn : betItemsName
  },
  {
    label: t('所属局数'),
    prop: 'level',
    width: 150,
    headerRenderer: d => handleTableWidth(d, t('所属局数'), 'auto'),
    formatter: ({ handicapFilter }) => {
      return handicapFilter
        ? NAV_TITLE_NAME[JSON.parse(handicapFilter).toString()]
        : '-';
    }
  },
  {
    label: t('盘口投注项'),
    slot: 'betOptions',
    minWidth: 300
  },
  {
    label: t('操作'),
    slot: 'operaction',
    minWidth: 200
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
