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
    prop: 'tenantName',
    minWidth: 150,
  },
  {
    label: t('风控标签'),
    slot: 'riskControlLabel',
    width: 350
  },
  {
    label: t('属性标签'),
    slot: 'attributeLabel',
    width: 350,
  },
  {
    label: t('特殊限额'),
    minWidth: 150,
    formatter: () => {
      return '-';
    }
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

export const recordColumns: TableColumnList = [
  {
    label: t('标签名称'),
    prop: 'labelName',
  },
  {
    label: t('动作'),
    prop: 'opt',
  },
  {
    label: t('操作人'),
    prop: 'createdBy',
  },
  {
    label: t('修改时间'),
    prop: 'updatedAt',
    formatter({ updatedAt }) {
      return dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  
]