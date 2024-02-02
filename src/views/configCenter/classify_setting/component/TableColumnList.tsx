import { t } from '@/plugins/i18n';
import { parseCountry } from '@/utils/formatMatch';

export const columns: TableColumnList = [
  {
    label: t('分类ID'),
    prop: 'teamId'
  },
  {
    label: t('分类名称'),
    prop: 'countryId',
    formatter: ({ countryId }) => parseCountry(countryId)
  },
  {
    label: t('操作'),
    fixed: 'right',
    width: 240,
    slot: 'operation'
  }
];
