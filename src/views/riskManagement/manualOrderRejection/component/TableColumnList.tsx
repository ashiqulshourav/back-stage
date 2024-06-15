import { t } from '@/plugins/i18n';
import { handleTableWidth } from '@/utils/getTableWidth';

export const columns: TableColumnList = [
  {
    label: t('序号'),
    type: 'index',
    headerRenderer: d => handleTableWidth(d, t('序号'), 'auto'),
    minWidth: 50
  },
  {
    label: t('用户信息'),
    slot: 'userMessage',
    minWidth: 100,
    align: 'left',
    headerRenderer: d => handleTableWidth(d, t('用户信息'), 'auto')
  },
  {
    label: t('赛事信息'),
    slot: 'matchMessage',
    minWidth: 200,
    align: 'left',
    className: 'getParent',
    headerRenderer: d => handleTableWidth(d, t('赛事信息'), 'auto')
  },
  {
    label: t('注单详情'),
    slot: 'betDetail',
    minWidth: 200,
    align: 'left',
    className: 'getParent',
    headerRenderer: d => handleTableWidth(d, t('注单详情'), 'auto')
  },
  {
    label: t('接拒状态'),
    slot: 'orderAcceptanceStatus',
    minWidth: 100,
    className: 'position getParent',
    headerRenderer: d => handleTableWidth(d, t('接拒状态'), 'auto')
  },
  // {
  //   label: t('状态'),
  //   slot: 'status',
  //   headerRenderer: d => handleTableWidth(d, t('状态'), 'auto')
  // },
  {
    label: t('赔率'),
    slot: 'odd',
    minWidth: 100,
    align: 'center',
    className: 'getParent',
    headerRenderer: d => handleTableWidth(d, t('赔率'), 'auto')
  },
  {
    label: t('投注额'),
    prop: 'productAmountTotal',
    minWidth: 100,
    formatter: ({ productAmountTotal }) =>
      productAmountTotal ? productAmountTotal.toFixed(2) : 0,
    headerRenderer: d => handleTableWidth(d, t('投注额'), 'auto')
  },
  // {
  //   label: t('用户输赢'),
  //   slot: 'profitAmount',
  //   minWidth: 50,
  //   align: 'center',
  //   headerRenderer: d => handleTableWidth(d, t('用户输赢'), 'auto')
  // },
  {
    label: t('操作'),
    slot: 'operation',
    className: 'position getParent',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('操作'), 'auto'),
    align: 'center'
  }
];
