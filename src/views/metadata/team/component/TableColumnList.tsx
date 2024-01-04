import { t } from '@/plugins/i18n';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { handleTableWidth } from '@/utils/getTableWidth';

export const columns: TableColumnList = [
  {
    label: t('球队ID'),
    prop: 'teamId',
    headerRenderer: d => handleTableWidth(d, t('球队ID'))
  },
  {
    label: t('球队Logo'),
    prop: 'teamLogo',
    slot: 'teamLogo',
    headerRenderer: d => handleTableWidth(d, t('球队Logo'))
  },
  {
    label: t('国家地区ID'),
    prop: 'countryId',
    headerRenderer: d => handleTableWidth(d, t('国家地区ID'))
  },
  {
    label: t('是否国家队'),
    prop: 'isCountryTeam',
    slot: 'isCountryTeam',
    headerRenderer: d => handleTableWidth(d, t('是否国家队'))
  },
  {
    label: t('联赛ID'),
    prop: 'leagueId',
    headerRenderer: d => handleTableWidth(d, t('联赛ID'))
  },
  {
    label: t('球队等级'),
    prop: 'level',
    headerRenderer: d => handleTableWidth(d, t('球队等级'))
  },
  {
    label: t('赛种'),
    prop: 'sportId',
    formatter: ({ sportId }): string =>
      SPORT_ID_MAP.find(_ => _.value === sportId).label,
    headerRenderer: d => handleTableWidth(d, t('赛种'))
  },
  {
    label: t('主场名称'),
    prop: 'stadiumName',
    slot: 'stadiumName',
    headerRenderer: d => handleTableWidth(d, t('主场名称'))
  },
  {
    label: t('球队中文名称'),
    prop: 'teamNameCn',
    align: 'left',
    headerRenderer: d => handleTableWidth(d, t('球队中文名称'))
  },
  {
    label: t('球队英文名称'),
    prop: 'teamNameEn',
    align: 'left',
    headerRenderer: d => handleTableWidth(d, t('球队英文名称'))
  }
  // {
  //   label: t('操作'),
  //   fixed: "right",
  //   width: 240,
  //   slot: "operation"
  // }
];
