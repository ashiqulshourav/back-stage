import { handleTableWidth } from '@/utils/getTableWidth';
import dayjs from 'dayjs';
import { parseCountry } from '@/utils/formatMatch';
import {
  ESPORT_ID_MAP,
  OPENING_STATUS,
  SPORT_ID_MAP
} from '@/utils/maps/sports_map';

export const columns: TableColumnList = [
  {
    type: 'selection',
    align: 'left',
    selectable: row => !(row.saleHandicaps === 0 && row.allHandicaps === 0)
  },
  {
    label: t('锁盘'),
    headerRenderer: d => handleTableWidth(d, t('锁盘'), 'auto'),
    slot: 'lock'
  },
  {
    label: t('联赛名称'),
    prop: 'leagueNameCn',
    headerRenderer: d => handleTableWidth(d, t('联赛名称'), 'auto'),
    formatter: ({ leagueNameCn }) => leagueNameCn || '-',
    align: 'left',
    minWidth: 200
  },
  {
    label: t('游戏种类'),
    prop: 'sportId',
    headerRenderer: d => handleTableWidth(d, t('游戏种类'), 'auto'),
    formatter: ({ sportId, category }) => {
      const arr = category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
      return arr.find(_ => _.value === sportId)?.label ?? '-';
    },
    minWidth: 120
  },
  {
    label: t('联赛ID'),
    prop: 'leagueId',
    headerRenderer: d => handleTableWidth(d, t('联赛ID'), 'auto')
  },
  {
    label: t('热门排序'),
    prop: 'level',
    minWidth: 100,
    headerRenderer: d => handleTableWidth(d, t('热门排序'), 'auto')
  },
  {
    label: t('赛事ID'),
    prop: 'matchId',
    minWidth: 120,
    headerRenderer: d => handleTableWidth(d, t('赛事ID'), 'auto')
  },
  {
    label: t('主队'),
    prop: 'homeTeamNameCn',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('主队'), 'auto'),
    align: 'left'
  },
  {
    label: t('客队'),
    prop: 'awayTeamNameCn',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('客队'), 'auto'),
    align: 'left'
  },
  {
    label: t('国家/地区'),
    prop: 'countryId',
    headerRenderer: d => handleTableWidth(d, t('国家/地区'), 'auto'),
    formatter: ({ countryId }) => parseCountry(countryId)
  },
  {
    label: t('开赛时间'),
    prop: 'beginTimeLong',
    formatter: ({ beginTimeLong }) =>
      dayjs(beginTimeLong).format('YYYY-MM-DD HH:mm:ss'),
    headerRenderer: d => handleTableWidth(d, t('开赛时间'), 'auto'),
    width: 200
  },
  /*  {
    label: t('当前比分'),
    prop: 'currentScore',
    formatter: ({ currentScore }) =>
      currentScore.replace(/H(\d+)A(\d+)/, '$1 - $2'),
    headerRenderer: d => handleTableWidth(d, t('当前比分'), 'auto')
  }, */
  {
    label: t('盘口状态'),
    prop: 'handicapStatus',
    headerRenderer: d => handleTableWidth(d, t('盘口状态'), 'auto'),
    formatter: ({ handicapStatus }): string => OPENING_STATUS[handicapStatus],
    minWidth: 150
  },
  {
    label: t('开售盘口/总盘口数'),
    slot: 'saleHandicaps',
    headerRenderer: d => handleTableWidth(d, t('开售盘口/总盘口数'), 'auto'),
    minWidth: 150,
    fixed: 'right'
  },
  {
    label: t('开售控制'),
    slot: 'isSale',
    headerRenderer: d => handleTableWidth(d, t('开售控制'), 'auto'),
    fixed: 'right'
  },
  /*  {
    label: t('开售状态'),
    headerRenderer: d => handleTableWidth(d, t('开售状态'), 'auto'),
    formatter: ({ isSale }) => (isSale ? t('已开售') : t('未开售'))
  }, */

  {
    label: t('操作'),
    fixed: 'right',
    width: 100,
    slot: 'operation'
  }
];
