import { handleTableWidth } from '@/utils/getTableWidth';
// import { parseMatchScore } from '@/utils/formatMatch';

export const columns: TableColumnList = [
  {
    type: 'expand',
    slot: 'expand',
    fixed: true
  },
  {
    label: t('序号'),
    fixed: true,
    type: 'index',
    minWidth: 100,
    headerRenderer: d => handleTableWidth(d, t('序号'))
  }
];

export const childColumns: TableColumnList = [
  {
    type: 'expand',
    slot: 'expand',
    fixed: true
  },
  {
    label: t('序号'),
    fixed: true,
    type: 'index',
    minWidth: 100,
    headerRenderer: d => handleTableWidth(d, t('序号'))
  }
];
