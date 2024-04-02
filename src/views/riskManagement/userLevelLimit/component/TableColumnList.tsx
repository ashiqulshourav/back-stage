import { t } from '@/plugins/i18n';

export const columns: TableColumnList = [
  {
    label: t('用户限额等级'),
    prop: 'levelLimit'
  },
  {
    label: t('单用户单注限额'),
    slot: 'productAmountTotalLimit'
  },
  {
    label: t('单用户单注赔付'),
    slot: 'maxWinAmountLimit'
  },
  {
    label: t('单用户单场赛事赔付'),
    slot: 'userSingleGamePay'
  },
  {
    label: t('单关单日累计赔付'),
    slot: 'singleMatchPay'
  },
  {
    label: t('串关单日累计赔付'),
    slot: 'bunchMatchPay'
  },
  {
    label: t('冠军单日累计赔付'),
    slot: 'championDailyPay'
  }
];
