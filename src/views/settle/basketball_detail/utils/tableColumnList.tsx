import { handleTableWidth } from '@/utils/getTableWidth';
// import { parseMatchScore } from '@/utils/formatMatch';

export const columns: TableColumnList = [
  {
    label: t('盘'),
    prop: 'level',
    width: 50
  },
  {
    minWidth: 100,
    headerRenderer: () => {
      return '王鑫';
    }
  },
  {
    label: t('盘'),
    headerRenderer: () => {
      return '小岛菜菜';
    }
  },
  {
    label: t('盘'),
    headerRenderer: () => {
      return '比赛阶段';
    }
  },
  
  {
    label: t('结算时间'),
    minWidth: 100,
    cellRenderer: () => {
      return '2023-05-11';
    }
  },
  {
    label: t('操作人'),
    minWidth: 100
  },
  {
    label: t('状态'),
    minWidth: 100
  },
  {
    label: t('操作'),
    minWidth: 100
  }
];

export const childColumns: TableColumnList = [
  {
    label: t('序号'),
    fixed: true,
    type: 'index',
    minWidth: 100,
    headerRenderer: d => handleTableWidth(d, t('序号'))
  }
];
