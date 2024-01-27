import { NAV_TITLE_NAME } from './map';

export const columns: TableColumnList = [
  {
    label: t('盘口ID'),
    prop: 'betItemsId'
  },
  {
    label: t('盘口名称'),
    prop: 'betItemsName',
    minWidth: 200
  },
  {
    label: t('所属局数'),
    prop: 'level',
    formatter: ({ handicapFilter }) => {
      return handicapFilter
        ? NAV_TITLE_NAME[JSON.parse(handicapFilter).toString()]
        : '-';
    }
  },
  {
    label: t('盘口投注项'),
    slot: 'betOptions',
    minWidth: 200
  },
  {
    label: t('操作'),
    slot: 'operaction',
    minWidth: 150
  },
  // {
  //   label: t('盘口状态'),
  //   prop: 'currentScore',
  //   formatter: ({ currentScore }) =>
  //     currentScore.replace(/H(\d+)A(\d+)/, '$1 - $2')
  // },
  {
    label: t('结算时间'),
    prop: 'awayTeamId',
    minWidth: 150
  }
];
