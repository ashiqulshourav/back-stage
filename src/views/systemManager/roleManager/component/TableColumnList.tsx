import { t } from '@/plugins/i18n';

export const columns: TableColumnList = [
  {
    label: t('角色名称'),
    prop: 'name'
  },
  {
    label: t('创建时间'),
    prop: 'createdAt'
  },
  {
    label: t('创建人'),
    prop: 'createdBy'
  },
  {
    label: t('使用人数'),
    formatter: ({ userList }) => userList.length
  },
  {
    label: t('状态'),
    slot: 'status'
  },
  {
    label: t('备注'),
    prop: 'comment',
    formatter: ({ comment }) => comment ?? '-'
  },
  {
    label: t('操作'),
    minWidth: 200,
    slot: 'operation'
  }
];
