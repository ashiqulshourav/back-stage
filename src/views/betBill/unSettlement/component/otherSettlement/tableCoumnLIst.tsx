import { handleTableWidth } from '@/utils/getTableWidth';

export const columns: TableColumnList = [
  {
    label: '盘口ID',
    prop: 'id',
    fixed: true,
    width: 250,
    headerRenderer: d => handleTableWidth(d, '盘口ID'),
  },
  {
    label: '玩法名称',
    prop: 'away',
    fixed: true,
    width: 262,
    headerRenderer: d => handleTableWidth(d, '玩法名称')
  },
  {
    label: '盘口投注项',
    prop: 'time',
    width: 300,
    headerRenderer: d => handleTableWidth(d, '盘口投注项')
  },
  {
    label: '盘口状态',
    prop: 'manager',
    width: 250,
    headerRenderer: d => handleTableWidth(d, '盘口状态')
  },
  {
    label: '操作人',
    prop: 'status',
    width: 250,
    headerRenderer: d => handleTableWidth(d, '操作人')
  },
  {
    label: '结算时间',
    prop: 'operation',
    width: 300,
    headerRenderer: d => handleTableWidth(d, '结算时间')
  },
];