import { handleTableWidth } from '@/utils/getTableWidth';
import dayjs from 'dayjs';
import { t } from '@/plugins/i18n';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';

export const columns: TableColumnList = [
  {
    label: t('赛事ID'),
    prop: 'matchId',
    headerRenderer: d => handleTableWidth(d, t('赛事ID'), 'auto')
  },
  {
    label: t('赛事名称'),
    prop: 'matchName',
    headerRenderer: d => handleTableWidth(d, t('赛事名称'), 'auto'),
    align: 'left',
    width: 200
  },
  {
    label: t('赛事等级'),
    prop: 'level',
    headerRenderer: d => handleTableWidth(d, t('赛事等级'), 'auto')
  },
  {
    label: t('比赛时间'),
    prop: 'beginTimeLong',
    formatter: ({ beginTimeLong }) =>
      dayjs(beginTimeLong).format('YYYY-MM-DD HH:mm:ss'),
    headerRenderer: d => handleTableWidth(d, t('比赛时间'), 'auto'),
    width: 200
  },
  {
    label: t('主队'),
    prop: 'homeTeamNameCn',
    headerRenderer: d => handleTableWidth(d, t('主队'), 'auto')
  },
  {
    label: t('当前比分'),
    prop: 'currentScore',
    formatter: ({ currentScore }) =>
      currentScore.replace(/H(\d+)A(\d+)/, '$1 - $2'),
    headerRenderer: d => handleTableWidth(d, t('当前比分'), 'auto')
  },
  {
    label: t('客队'),
    prop: 'awayTeamNameCn',
    headerRenderer: d => handleTableWidth(d, t('客队'), 'auto')
  },
  {
    label: t('国家地区ID'),
    prop: 'countryId',
    headerRenderer: d => handleTableWidth(d, t('国家地区ID'), 'auto')
  },
  {
    label: t('赛种'),
    prop: 'sportId',
    formatter: ({ sportId }): string =>
      SPORT_ID_MAP.find(_ => _.value === sportId).label,
    minWidth: 150
  },
  {
    label: t('是否中立场地'),
    slot: 'isNeutral',
    headerRenderer: d => handleTableWidth(d, t('是否中立场地'), 'auto')
  },
  {
    label: t('开售状态'),
    slot: 'isSale',
    headerRenderer: d => handleTableWidth(d, t('开售状态'), 'auto')
  },
  {
    label: t('联赛杯赛ID'),
    prop: 'leagueId',
    headerRenderer: d => handleTableWidth(d, t('联赛杯赛ID'), 'auto')
  },
  {
    label: t('操作'),
    fixed: 'right',
    width: 240,
    slot: 'operation'
  }
];
