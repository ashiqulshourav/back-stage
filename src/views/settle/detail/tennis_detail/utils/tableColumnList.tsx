// import { parseMatchScore } from '@/utils/formatMatch';

import { handleTableWidth } from '@/utils/getTableWidth';

export const columns: TableColumnList = [
  {
    type: 'expand',
    slot: 'expand'
  },
  {
    label: t('盘'),
    prop: 'inningNum',
    type: 'index',
    minWidth: 100,
    headerRenderer: d => handleTableWidth(d, t('盘'))
  },
  {
    label: history.state.params.homeTeamNameCn ?? '_',
    headerRenderer: d =>
      handleTableWidth(d, history.state.params.homeTeamNameCn ?? '_'),
    formatter: ({ t1 }) => t1
  },
  {
    label: history.state.params.homeTeamNameCn ?? '_',
    headerRenderer: d =>
      handleTableWidth(d, history.state.params.awayTeamNameCn ?? '_'),
    formatter: ({ t2 }) => t2
  },
  {
    label: t('操作'),
    slot: 'operation'
  }
];

export const childColumns: TableColumnList = [
  {
    label: t('局'),
    prop: 'inningNum',
    type: 'index'
  },
  {
    headerRenderer: () => history.state.params.homeTeamNameCn ?? '_',
    slot: 'secondT1',
    width: 260
  },
  {
    headerRenderer: () => history.state.params.awayTeamNameCn ?? '_',
    slot: 'secondT2',
    width: 260
  },
  {
    label: t('操作人'),
    formatter: ({ updatedBy }) => {
      return updatedBy ? updatedBy : '_';
    }
  },
  {
    label: t('状态'),
    formatter: ({ settleType }) => {
      return settleType === 0 ? t('自动结算') : t('人工结算');
    }
  },
  {
    label: t('数据商'),
    slot: 'dataSourceCode'
  },
  {
    label: t('结算次数'),
    prop: 'settleTimes'
  },
  {
    label: t('操作'),
    slot: 'childOperation'
  }
];
