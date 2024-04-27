import { t } from '@/plugins/i18n';

// 足球 篮球,其他赛种
export const columns: TableColumnList = [
  {
    label: t('联赛等级'),
    prop: 'leagueLevel'
  },
  {
    label: t('单用户单场累计赔付限额'),
    slot: 'singleUserMaxWin'
  },
  {
    label: t('让球'),
    children: [
      {
        label: t('单玩法累计期望赔付'),
        slot: 'handicapSingleMaxWin'
      },
      {
        label: t('全场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'handicapWholeMaxBetMorning'
          },
          {
            label: t('滚球'),
            slot: 'handicapWholeMaxBetRolling'
          },
        ]
      },
      {
        label: t('半场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'handicapHalfMaxBetMoring'
          },
          {
            label: t('滚球'),
            slot: 'handicapHalfMaxBetRolling'
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
        slot: 'bigsmallSingleMaxWin'
      },
      {
        label: t('全场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'bigsmallWholeMaxBetMoring'
          },
          {
            label: t('滚球'),
            slot: 'bigsmallWholeMaxBetRolling'
          },
        ]
      },
      {
        label: t('半场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'bigsmallHalfMaxBetMoring'
          },
          {
            label: t('滚球'),
            slot: 'bigsmallHalfMaxBetRolling'
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
        slot: 'winSingleMaxWin'
      },
      {
        label: t('全场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'winWholeMaxBetMoring'
          },
          {
            label: t('滚球'),
            slot: 'winWholeMaxBetRolling'
          },
        ]
      },
      {
        label: t('半场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'winHalfMaxBetMoring'
          },
          {
            label: t('滚球'),
            slot: 'winHalfMaxBetRolling'
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
        slot: 'otherSingleMaxWin'
      },
      {
        label: t('早盘-单注最高可投金额'),
        slot: 'otherMaxBetMoring'
      },
      {
        label: t('滚球-单注最高可投金额'),
        slot: 'otherMaxBetRolling'
      },
    ]
  },

];


// 电竞
export const columns2: TableColumnList = [
  {
    label: t('联赛等级'),
    prop: 'leagueLevel'
  },
  {
    label: t('单用户单场累计期望赔付'),
    slot: 'singleUserMaxWin'
  },
  {
    label: t('单玩法累计期望赔付'),
    slot: 'esportSingleMaxWin'
  },
  {
    label: t('全局-单注最高可投金额'),
    children: [
      {
        label: t('早盘'),
        slot: 'esportWholeMaxBetMoring'
      },
      {
        label: t('滚球'),
        slot: 'esportWholeMaxBetRolling'
      },
    ]
  },
  {
    label: t('单局-单注最高可投金额'),
    children: [
      {
        label: t('早盘'),
        slot: 'esportSingleMaxBetMoring'
      },
      {
        label: t('滚球'),
        slot: 'esportSingleMaxBetRolling'
      },
    ]
  },
  {
    label: t('回合-单注最高可投金额'),
    children: [
      {
        label: t('早盘'),
        slot: 'esportRoundMaxBetMoring'
      },
      {
        label: t('滚球'),
        slot: 'esportRoundMaxBetRolling'
      },
    ]
  },
];