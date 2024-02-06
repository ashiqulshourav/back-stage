import { handleTableWidth } from '@/utils/getTableWidth';
// import { parseMatchScore } from '@/utils/formatMatch';
import { MATCH_PERIOD } from "@/utils/maps/sports_map";
export const columns: TableColumnList = [
  {
    label: t('盘'),
    prop: 'level',
    width: 50,
    type: 'index',
  },
  {
    minWidth: 100,
    prop: 't1',
    slot: 't1',
    headerRenderer: () => {
      return '王鑫';
    },
  },
  {
    label: t('小岛菜菜'),
    prop: 't2',
    slot: 't2',
    headerRenderer: () => {
      return '小岛菜菜';
    }
  },
  {
    label: t('比赛阶段'),
    prop: 'matchPeriod',
    slot: 'matchPeriod',
    headerRenderer: () => {
      return '比赛阶段';
    },
    formatter: ({ matchPeriod }) => {
      return MATCH_PERIOD[matchPeriod];
    }
  },
  
  {
    label: t('结算时间'),
    minWidth: 100,
    prop: 'eventTime'
  },
  {
    label: t('操作人'),
    minWidth: 100,
    formatter: () => {
      return '-';
    }
  },
  {
    label: t('状态'),
    minWidth: 100,
    prop: 'settleType',
    formatter: ({ settleType }) => {
      return settleType === '0' ? '自动结算' : settleType === 1 ? '⼈⼯結算' : '-'
    }
  },
  {
    label: t('操作'),
    minWidth: 100,
    slot: 'operation',
    formatter() {
      return '-';
    },
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
