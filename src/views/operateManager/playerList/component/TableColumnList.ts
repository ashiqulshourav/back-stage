import {
  ESPORT_ID_MAP,
  SPORT_ID_MAP,
  SPORT_CATEGORY
} from '@/utils/maps/sports_map';

export const columns: TableColumnList = [
  {
    label: t('序号'),
    prop: 'id',
    minWidth: 100
  },
  {
    label: t('用户名'),
    prop: 'category',
    minWidth: 150,
    formatter: ({ category }) =>
      SPORT_CATEGORY.find(item => item.value === category)?.label ?? '-'
  },
  {
    label: t('用户ID'),
    prop: 'sportId',
    formatter: ({ sportId, category }): string => {
      const arr = category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
      return arr.find(_ => _.value === sportId)?.label ?? '-';
    },
    minWidth: 150
  },
  {
    label: t('所属商户'),
    prop: 'text',
    minWidth: 150
  },
  {
    label: t('限额等级'),
    prop: 'text',
    minWidth: 150
  },
  {
    label: t('注册日期'),
    prop: 'text',
    minWidth: 150
  },
  {
    label: t('最后投注时间'),
    prop: 'text',
    minWidth: 150
  },
  {
    label: t('投注额'),
    prop: 'text',
    minWidth: 150
  }, {
    label: t('用户输赢金额'),
    prop: 'text',
    minWidth: 150
  }, {
    label: t('用户盈利率'),
    prop: 'text',
    minWidth: 150
  },
  {
    label: t('单均'),
    prop: 'text',
    minWidth: 150
  },
  {
    label: t('备注'),
    prop: 'text',
    minWidth: 150
  },
  {
    label: t('操作'),
    fixed: 'right',
    minWidth: 150,
    slot: 'operation'
  },
];
