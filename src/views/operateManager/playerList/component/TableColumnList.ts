import dayjs from 'dayjs';

export const columns: TableColumnList = [
  {
    type: 'selection',
    align: 'left'
  },
  {
    label: t('用户ID'),
    prop: 'id',
    minWidth: 200
  },
  {
    label: t('所属商户'),
    prop: 'userName',
    minWidth: 150
  },

  {
    label: t('风控标签'),
    prop: 'tenantName',
    minWidth: 150
  },
  {
    label: t('属性标签'),
    prop: 'tenantCode',
    minWidth: 150
  },
  {
    label: t('最后下注时间'),
    prop: 'createdAt',
    formatter({ createdAt }) {
      return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss');
    },
    minWidth: 250
  },

  {
    label: t('操作'),
    fixed: 'right',
    minWidth: 150,
    slot: 'operation'
  }
];
