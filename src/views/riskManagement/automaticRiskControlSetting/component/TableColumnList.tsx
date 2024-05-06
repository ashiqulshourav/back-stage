import { t } from '@/plugins/i18n';

// 足球 篮球,其他赛种
export const columns: TableColumnList = [
  {
    label: t('条件名称'),
    slot: 'conditionName'
  },
  {
    label: t('观察期限'),
    slot: 'observationPeriod'
  },
  {
    label: t('注单数量'),
    slot: 'numberOfBets'
  },
  {
    label: t('用户输赢金额'),
    slot: 'winLossAmount'
  },
  {
    label: t('用户输赢率'),
    slot: 'winLossRate'
  },
  {
    label: t('自动用户等级限额'),
    slot: 'userLevelQuota'
  },
  {
    label: t('自动风控标签名称'),
    slot: 'riskControlLabelName'
  }
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
      }
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
      }
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
      }
    ]
  }
];
