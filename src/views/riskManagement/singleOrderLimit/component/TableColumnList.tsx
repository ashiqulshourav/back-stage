import { t } from '@/plugins/i18n';

export const columns: TableColumnList = [
  {
    label: t('联赛等级'),
    prop: 'levelLimit'
  },
  {
    label: t('单玩法累计期望赔付'),
    slot: 'maxWinAmountLimit'
  },
  {
    label: t('让球'),
    children: [
      {
        label: t('单玩法累计期望赔付'),
        slot: 'maxWinAmountLimit'
      },
      {
        label: t('全场让球-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'userSingleGamePay'
          },
          {
            label: t('滚球'),
            slot: 'singleMatchPay'
          },
        ]
      },
      {
        label: t('半场让球-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'userSingleGamePay'
          },
          {
            label: t('滚球'),
            slot: 'singleMatchPay'
          },
        ]
      },
    ]
  },
  {
    label: t('大小'),
    children: [
      {
        label: t('单玩法累计期望赔付'),
        slot: 'maxWinAmountLimit'
      },
      {
        label: t('全场让球-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'userSingleGamePay'
          },
          {
            label: t('滚球'),
            slot: 'singleMatchPay'
          },
        ]
      },
      {
        label: t('半场让球-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'userSingleGamePay'
          },
          {
            label: t('滚球'),
            slot: 'singleMatchPay'
          },
        ]
      },
    ]
  },
  {
    label: t('独赢'),
    children: [
      {
        label: t('单玩法累计期望赔付'),
        slot: 'maxWinAmountLimit'
      },
      {
        label: t('全场让球-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'userSingleGamePay'
          },
          {
            label: t('滚球'),
            slot: 'singleMatchPay'
          },
        ]
      },
      {
        label: t('半场让球-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'userSingleGamePay'
          },
          {
            label: t('滚球'),
            slot: 'singleMatchPay'
          },
        ]
      },
    ]
  },
  {
    label: t('其他玩法'),
    children: [
      {
        label: t('单玩法累计期望赔付'),
        slot: 'championDailyPay2'
      },
      {
        label: t('早盘-单注最高可投金额'),
        slot: 'championDailyPay2'
      },
      {
        label: t('滚球-单注最高可投金额'),
        slot: 'championDailyPay2'
      },
    ]
  },

];
