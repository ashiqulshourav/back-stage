import { t } from '@/plugins/i18n';
import { parseCountry } from '@/utils/formatMatch';
import { ESPORT_ID_MAP } from '@/utils/maps/sports_map';

export const columns: TableColumnList = [
  {
    label: t('联赛ID'),
    prop: 'leagueId'
  },
  {
    label: t('国家'),
    prop: 'countryId',
    formatter: ({ countryId }) => parseCountry(countryId)
  },
  {
    label: t('188数据源联赛ID'),
    prop: 'leagueId188Bet'
  },
  {
    label: t('联赛LOGO'),
    slot: 'leagueLogo'
  },
  {
    label: t('游戏分类'),
    formatter: ({ sportId }) =>
      ESPORT_ID_MAP.find(item => item.value === sportId)?.label
  },
  {
    label: t('联赛中文名'),
    prop: 'leagueNameCn',
    align: 'left'
  },
  {
    label: t('联赛英文名'),
    prop: 'leagueNameEn',
    align: 'left'
  },
  {
    label: t('热门排序'),
    prop: 'level'
  },
  {
    label: t('操作'),
    slot: 'operation'
  }
];
