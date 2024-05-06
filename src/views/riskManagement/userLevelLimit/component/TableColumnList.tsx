import { t } from '@/plugins/i18n';

export const columns: TableColumnList = [
  {
    label: t('用户限额等级'),
    prop: 'levelLimit'
  },
  {
    label: t('单注投注限额'),
    slot: 'productAmountTotalLimit'
  },
  {
    label: t('单注赔付限额'),
    slot: 'maxWinAmountLimit'
  },
  {
    label: t('单场赛事累计赔付限额(不分早盘滚球)'),
    slot: 'userSingleGamePay',
    width: 150
  },
  {
    label: t('单关单日累计赔付'),
    slot: 'singleMatchPay'
  },
  {
    label: t('串关单日累计赔付限额(不分早盘滚球)'),
    slot: 'bunchMatchPay',
    width: 150
  },
  {
    label: t('冠军单日累计赔付'),
    slot: 'championDailyPay'
  }
];
