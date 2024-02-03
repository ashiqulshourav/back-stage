import { handleTableWidth } from '@/utils/getTableWidth';

const chineseDigits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
export const columns: TableColumnList = [
  {
    label: '届',
    prop: 'index',
    fixed: true,
    width: 100,
    formatter: ({index}) => `第${chineseDigits[index]}届`,
    headerRenderer: d => handleTableWidth(d, '届')
  },
  {
    label: '王欣',
    prop: 'home',
    fixed: true,
    width: 250,
    headerRenderer: d => handleTableWidth(d, '王欣'),
  },
  {
    label: '小鸟菜菜绪',
    prop: 'away',
    fixed: true,
    width: 250,
    headerRenderer: d => handleTableWidth(d, '小鸟菜菜绪')
  },
  {
    label: '结算时间',
    prop: 'time',
    width: 300,
    headerRenderer: d => handleTableWidth(d, '结算时间')
  },
  {
    label: '操作人',
    prop: 'manager',
    width: 200,
    headerRenderer: d => handleTableWidth(d, '操作人')
  },
  {
    label: '状态',
    prop: 'status',
    width: 250,
    headerRenderer: d => handleTableWidth(d, '状态')
  },
  {
    label: '操作',
    prop: 'operation',
    width: 250,
    headerRenderer: d => handleTableWidth(d, '操作')
  },
];