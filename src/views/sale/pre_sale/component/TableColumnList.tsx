import { handleTableWidth } from '@/utils/getTableWidth';
import dayjs from 'dayjs';
import { t } from '@/plugins/i18n';
import { IconifyIconOffline } from '@/components/ReIcon';

export const columns: TableColumnList = [
  {
    type: 'selection',
    align: 'left'
  },
  {
    label: t('锁盘'),
    slot: 'locking',
    headerRenderer: d => handleTableWidth(d, t('锁盘'), 'auto'),
    formatter: ({ locking }) => {
      return <IconifyIconOffline icon="lockUnlockFill" />;
    }
  },
  {
    label: t('联赛名称'),
    prop: 'leagueNameCn',
    headerRenderer: d => handleTableWidth(d, t('联赛名称'), 'auto'),
    align: 'left'
  },
  {
    label: t('联赛ID'),
    prop: 'leagueId',
    headerRenderer: d => handleTableWidth(d, t('联赛ID'), 'auto')
  },
  {
    label: t('赛事等级'),
    prop: 'level',
    sortable: true,
    headerRenderer: d => handleTableWidth(d, t('赛事等级'), 'auto')
  },
  {
    label: t('赛事ID'),
    prop: 'matchId',
    headerRenderer: d => handleTableWidth(d, t('赛事ID'), 'auto')
  },
  {
    label: t('主队'),
    prop: 'homeTeamNameCn',
    headerRenderer: d => handleTableWidth(d, t('主队'), 'auto'),
    align: 'left'
  },
  {
    label: t('客队'),
    prop: 'awayTeamNameCn',
    headerRenderer: d => handleTableWidth(d, t('客队'), 'auto'),
    align: 'left'
  },
  {
    label: t('国家/地区'),
    prop: 'countryId',
    headerRenderer: d => handleTableWidth(d, t('国家/地区'), 'auto')
  },
  {
    label: t('开赛时间'),
    sortable: true,
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
  /*  {
    label: t('赛种'),
    prop: 'sportId',
    formatter: ({ sportId }): string =>
      SPORT_ID_MAP.find(_ => _.value === sportId).label,
    minWidth: 150
  }, */
  {
    label: t('开售状态'),
    slot: 'isSale',

    headerRenderer: d => handleTableWidth(d, t('开售状态'), 'auto')
  },
  {
    label: t('开售盘口'),
    slot: 'num',
    headerRenderer: d => handleTableWidth(d, t('开售盘口'), 'auto')
  },

  {
    label: t('操作'),
    fixed: 'right',
    width: 100,
    slot: 'operation'
  }
];
