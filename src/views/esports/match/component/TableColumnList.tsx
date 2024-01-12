import { t } from '@/plugins/i18n';
import { useMatchStore } from '@/store/match';
import { parseCountry } from '@/utils/formatMatch';

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
  // {
  //   label: t('联赛LOGO'),
  //   prop: 'leagueLogo',
  //   formatter: ({ leagueLogo }) => (leagueLogo ? leagueLogo : '-')
  // },
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
    label: t('赛事等级'),
    prop: 'level'
  }
  // {
  //   label: t('操作'),
  //   slot: 'operation',
  //   align: 'right'
  // }
];
