import {
  ESPORT_ID_MAP,
  SPORT_ID_MAP,
  SPORT_CATEGORY
} from '@/utils/maps/sports_map';

export const columns: TableColumnList = [
  {
    label: t('联赛标签ID'),
    prop: 'id',
    minWidth: 100
  },
  {
    label: t('赛事类型'),
    prop: 'categoryId',
    minWidth: 150,
    formatter: ({ categoryId }) =>
      SPORT_CATEGORY.find(item => item.value === categoryId)?.label ?? '-'
  },
  {
    label: t('赛种'),
    prop: 'sportId',
    formatter: ({ sportId, categoryId }): string => {
      const arr = categoryId === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
      return arr.find(_ => _.value === sportId)?.label ?? '-';
    },
    minWidth: 150
  },
  {
    label: t('标签名称'),
    // sortable: true,
    prop: 'tagName',
    minWidth: 150
  },
  {
    label: t('操作'),
    fixed: 'right',
    width: 240,
    slot: 'operation'
  }
];
