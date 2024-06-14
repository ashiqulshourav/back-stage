import { handleTableWidth } from '@/utils/getTableWidth';
import { MATCH_STATUS } from '@/utils/maps/sports_map';
import { getLan } from '@/utils/utilFn';
import dayjs from 'dayjs';

const baseColumns: TableColumnList = [
  {
    label: t('序号'),
    fixed: true,
    type: 'index',
    minWidth: 100,
    headerRenderer: d => handleTableWidth(d, t('序号'), 'auto')
  },
  {
    prop: 'leagueNameCn',
    label: t('联赛名称'),
    fixed: true,
    align: 'left',
    headerRenderer: d => handleTableWidth(d, t('联赛名称'), 'auto'),
    minWidth: 160
  },
  {
    label: t('赛事ID'),
    prop: 'matchId',
    headerRenderer: d => handleTableWidth(d, t('赛事ID'))
  },
  {
    label: t('热门排序'),
    prop: 'level',
    width: 130,
    headerRenderer: d => handleTableWidth(d, t('热门排序'), 'auto')
  },
  {
    label: t('开赛时间'),
    prop: 'beginTimeLong',
    minWidth: 200,
    formatter: ({ beginTimeLong }) =>
      dayjs(beginTimeLong).format('YYYY-MM-DD HH:mm:ss'),
    headerRenderer: d => handleTableWidth(d, t('开赛时间'), 'auto')
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
    label: t('客队'),
    prop: 'awayTeamNameCn',
    align: 'left',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('客队'), 'auto')
  },
  {
    label: t('比赛状态'),
    prop: 'status',
    width: 150,
    formatter: ({ status }) =>
      MATCH_STATUS[status as keyof typeof MATCH_STATUS] ?? '-',
    headerRenderer: d => handleTableWidth(d, t('比赛状态'), 'auto')
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
    label: t('操作'),
    slot: 'operation',
    showOverflowTooltip: false,
    minWidth: getLan() === 'zh' ? 220 : 300,
    fixed: 'right'
  }
];
export const columns: TableColumnList = baseColumns;
