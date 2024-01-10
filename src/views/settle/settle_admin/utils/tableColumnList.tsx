import dayjs from 'dayjs';
import { handleTableWidth } from '@/utils/getTableWidth';
import { MATCH_STATUS } from '@/utils/maps/sports_map';

export const columns: TableColumnList = [
  {
    type: 'expand',
    slot: 'expand',
    fixed: true
  },
  {
    label: t('序号'),
    fixed: true,
    slot: 'sn',
    headerRenderer: d => handleTableWidth(d, t('序号'))
  },
  {
    prop: 'leagueNameCn',
    label: t('联赛名称'),
    fixed: true,
    align: 'left',
    headerRenderer: d => handleTableWidth(d, t('联赛名称'))
  },
  {
    label: t('赛事ID'),
    prop: 'matchId',
    headerRenderer: d => handleTableWidth(d, t('赛事ID'))
  },
  {
    label: t('赛事等级'),
    prop: 'level',
    headerRenderer: d => handleTableWidth(d, t('赛事等级'))
  },
  {
    label: t('比赛时间'),
    prop: 'beginTimeLong',
    minWidth: 200,
    formatter: ({ beginTimeLong }) =>
      dayjs(beginTimeLong).format('YYYY-MM-DD HH:mm:ss'),
    headerRenderer: d => handleTableWidth(d, t('比赛时间'), 'auto')
  },
  {
    label: t('主队'),
    prop: 'homeTeamNameCn',
    minWidth: 150,
    align: 'left',
    formatter: ({ homeTeamNameCn }) => homeTeamNameCn ?? '-',
    headerRenderer: d => handleTableWidth(d, t('主队'), 'auto')
  },
  {
    label: t('半场'),
    prop: 'halfTime',
    formatter: ({ halfTime }) => halfTime ?? '-',
    headerRenderer: d => handleTableWidth(d, t('半场'), 'auto')
  },
  {
    label: t('全场'),
    prop: 'wholeTime',
    formatter: ({ wholeTime }) => wholeTime ?? '-',
    headerRenderer: d => handleTableWidth(d, t('全场'), 'auto')
  },
  {
    label: t('客队'),
    prop: 'awayTeamNameCn',
    align: 'left',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('客队'), 'auto')
  },
  {
    label: t('审核员'),
    prop: 'auditor',
    formatter: ({ auditor }) => auditor || '-',
    headerRenderer: d => handleTableWidth(d, t('审核员'))
  },
  {
    label: t('操盘手'),
    prop: 'trader',
    formatter: ({ trader }) => trader || '-',
    headerRenderer: d => handleTableWidth(d, t('操盘手'))
  },
  {
    label: t('比赛状态'),
    prop: 'status',
    formatter: ({ status }) => MATCH_STATUS[status] ?? '-',
    headerRenderer: d => handleTableWidth(d, t('比赛状态'))
  },
  {
    label: t('待审核'),
    prop: 'peddingReview',
    formatter: ({ peddingReview }) => peddingReview || '-',
    headerRenderer: d => handleTableWidth(d, t('待审核'))
  },
  {
    label: t('赛事数据源'),
    prop: 'eventDataSource',
    formatter: ({ eventDataSource }) => eventDataSource || '-',
    headerRenderer: d => handleTableWidth(d, t('赛事数据源'))
  },
  {
    label: t('确认中'),
    prop: 'confirming',
    formatter: ({ confirming }) => confirming || '-',
    headerRenderer: d => handleTableWidth(d, t('确认中'))
  },
  {
    label: t('上半场结算'),
    prop: 'halfSettlementStatus',
    formatter: ({ halfSettlementStatus }) =>
      halfSettlementStatus === 0 ? (
        t('未结算')
      ) : (
        <el-text type="danger">{t('已结算')}</el-text>
      ),
    headerRenderer: d => handleTableWidth(d, t('上半场结算'))
  },

  {
    label: t('全场结算'),
    prop: 'fullSettlementStatus',
    formatter: ({ fullSettlementStatus }) =>
      fullSettlementStatus === 0 ? (
        t('未结算')
      ) : (
        <el-text type="danger">{t('已结算')}</el-text>
      ),
    headerRenderer: d => handleTableWidth(d, t('全场结算'))
  },
  {
    label: t('异常'),
    prop: 'abnormal',
    formatter: ({ abnormal }) => abnormal || '-',
    headerRenderer: d => handleTableWidth(d, t('异常'))
  }
  // {
  //   label: t("结算状态"),
  //   prop: "settleStatus",
  //   formatter: ({ settleStatus }) => settleStatus || '-'
  // },
  /* {
    label: t("操作"),
    prop: "operation",
    slot: 'operation',
    fixed: "right",
  }, */
];

export const childColumns: TableColumnList = [
  {
    label: t('主队事件数量'),
    prop: 't1'
  },
  {
    label: t('客队事件数量'),
    prop: 't2'
  },
  {
    label: t('事件编码'),
    slot: 'eventCode'
  },
  {
    label: t('事件发生时间'),
    slot: 'eventTime',
    headerRenderer: d => handleTableWidth(d, t('事件发生时间'))
  },
  {
    label: t('比赛阶段'),
    slot: 'matchPeriodId'
  },
  {
    label: t('主/客队'),
    slot: 'homeAway'
  },
  {
    label: t('1号球员名称'),
    slot: 'player1Name'
  },
  {
    label: t('事件是否被取消'),
    slot: 'canceled'
  },
  {
    label: t('操作'),
    slot: 'operation'
  },
  {
    label: t('结算次数'),
    formatter: ({}) => '-'
  },
  /* {
    label: t("未结算"),
    formatter: ({ }) => '-'
  },
  {
    label: t("已结算"),
    formatter: ({ }) => '-'
  }, */
  {
    label: t('数据商事件'),
    formatter: ({}) => '-'
    // headerRenderer: (d) => handleTableWidth(d, t('数据商事件'))
  }
];
