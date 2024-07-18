import dayjs from 'dayjs';
import { hasAuth } from '@/router/utils';

export const columns = (category: number): TableColumnList => {
  return [
    {
      type: 'selection',
      align: 'left'
    },
    {
      label: t('用户账号'),
      prop: 'userName',

      minWidth: 150,
    },
    {
      label: t('商户名称'),
      prop: 'tenantName',
      minWidth: 150,
      formatter({ tenantName }) {
        return tenantName ?? '-'
      },
    },
    {
      label: t('商户编码'),
      slot: 'tenantCode',
      minWidth: 150
    },
    {
      label: t('风控标签'),
      hide: !hasAuth('RISK_LABEL'),
      slot: 'riskControlLabel',
      width: 350
    },
    {
      label: t('属性标签'),
      hide: !hasAuth('ATTRIBUTE_LABEL'),
      slot: 'attributeLabel',
      width: 350
    },
    {
      label: t('限额等级'),
      hide: !hasAuth('LIMIT_LEVEL'),
      prop: 'limitLevel',
      minWidth: 150
    },
    {
      label: t('账号是否冻结'),
      prop: 'isFreeze',
      formatter({ isFreeze }) {
        return isFreeze === 1 ? t("冻结") : t('正常')
      },
      minWidth: 150
    },
    {
      label: t('特殊限额'),
      minWidth: 150,
      hide: !hasAuth('SEPCIAL_LIMIT'),
      formatter: ({
        maxWinAmountLimit,
        productAmountTotalLimit,
        seriesSingleDayCumulativeCompensationLimit,
        singleEventAccumulatedCompensationLimit
      }: {
        maxWinAmountLimit: number;
        productAmountTotalLimit: number;
        seriesSingleDayCumulativeCompensationLimit: number;
        singleEventAccumulatedCompensationLimit: number;
      }) => {
        if (
          maxWinAmountLimit ||
          productAmountTotalLimit ||
          seriesSingleDayCumulativeCompensationLimit ||
          singleEventAccumulatedCompensationLimit
        )
          return t('例外限额');
        else return t('无');
      }
    },
    {
      label: t('注册日期'),
      prop: 'createdAt',
      formatter({ createdAt }) {
        return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
      },
      minWidth: 250
    },
    {
      label: t('投注延时'),
      prop: 'betDelay',
      formatter({ betDelay, betDelayDj }) {
        console.log('TableColumnList.ts文件 5==============行打印=', category);
        return 123
        // return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
      },
      minWidth: 250
    },
    {
      label: t('备注'),
      prop: 'remark',
      formatter({ remark }) {
        return remark ?? '-'
      },
      minWidth: 150
    },

    {
      label: t('操作'),
      fixed: 'right',
      minWidth: 150,
      slot: 'operation'
    }
  ];
}

export const recordColumns: TableColumnList = [
  {
    label: t('标签名称'),
    prop: 'labelName'
  },
  {
    label: t('动作'),
    prop: 'opt'
  },
  {
    label: t('操作人'),
    prop: 'createdBy'
  },
  {
    label: t('修改时间'),
    prop: 'updatedAt',
    formatter({ updatedAt }: { updatedAt: string }) {
      return dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss');
    }
  }
];
