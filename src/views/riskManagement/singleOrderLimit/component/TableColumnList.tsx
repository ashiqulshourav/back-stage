import { t } from '@/plugins/i18n';
import dayjs from 'dayjs'
// 足球 篮球,其他赛种
export const columns: TableColumnList = [
  {
    label: t('联赛等级'),
    prop: 'leagueLevel',
    formatter: ({ leagueLevel }): string => {
      return leagueLevel === -1 ? '未评级' : leagueLevel;
    },
  },
  {
    label: t('单用户单场累计赔付限额'),
    slot: 'singleUserMaxWin',
    width: 100,
  },
  {
    label: t('让球'),
    children: [
      {
        label: t('单玩法累计期望赔付'),
        slot: 'handicapSingleMaxWin',
        width: 100,
      },
      {
        label: t('全场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'handicapWholeMaxBetMorning',
            width: 100,
          },
          {
            label: t('滚球'),
            slot: 'handicapWholeMaxBetRolling',
            width: 100,
          },
        ]
      },
      {
        label: t('半场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'handicapHalfMaxBetMoring',
            width: 100,
          },
          {
            label: t('滚球'),
            slot: 'handicapHalfMaxBetRolling',
            width: 100,
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
        slot: 'bigsmallSingleMaxWin',
        width: 100,
      },
      {
        label: t('全场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'bigsmallWholeMaxBetMoring',
            width: 100,
          },
          {
            label: t('滚球'),
            slot: 'bigsmallWholeMaxBetRolling',
            width: 100,
          },
        ]
      },
      {
        label: t('半场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'bigsmallHalfMaxBetMoring',
            width: 100,
          },
          {
            label: t('滚球'),
            slot: 'bigsmallHalfMaxBetRolling',
            width: 100,
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
        slot: 'winSingleMaxWin',
        width: 100,
      },
      {
        label: t('全场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'winWholeMaxBetMoring',
            width: 100,
          },
          {
            label: t('滚球'),
            slot: 'winWholeMaxBetRolling',
            width: 100,
          },
        ]
      },
      {
        label: t('半场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'winHalfMaxBetMoring',
            width: 100,
          },
          {
            label: t('滚球'),
            slot: 'winHalfMaxBetRolling',
            width: 100,
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
        slot: 'otherSingleMaxWin',
        width: 100,
      },
      {
        label: t('早盘-单注最高可投金额'),
        slot: 'otherMaxBetMoring',
        width: 100,
      },
      {
        label: t('滚球-单注最高可投金额'),
        slot: 'otherMaxBetRolling',
        width: 100,
      },
    ]
  },

];


// 电竞
export const columns2: TableColumnList = [
  {
    label: t('联赛等级'),
    prop: 'leagueLevel',
    formatter: ({ leagueLevel }): string => {
      return leagueLevel === -1 ? '未评级' : leagueLevel;
    },
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

export const recordColumns: TableColumnList = [
  {
    label: t('用户限额等级'),
    prop: 'name'
  },
  {
    label: t('单注投注限额'),
    prop: 'productAmountTotalLimit',
    formatter({ productAmountTotalLimit }) {
      return productAmountTotalLimit ? productAmountTotalLimit : '-';
    }
  },
  {
    label: t('单注赔付限额'),
    prop: 'maxWinAmountLimit',
    formatter({ maxWinAmountLimit }) {
      return maxWinAmountLimit ? maxWinAmountLimit : '-';
    }
  },
  {
    label: t('赛事限额'),
    prop: 'singleEventLimit',
    formatter({ singleEventLimit }) {
      return singleEventLimit ? singleEventLimit : '-';
    }
  },
  {
    label: t('单关限额'),
    prop: 'seriesSingleDayLimit',
    formatter({ seriesSingleDayLimit }) {
      return seriesSingleDayLimit ? seriesSingleDayLimit : '-';
    }
  },
  {
    label: t('串关限额'),
    prop: 'seriesSingleDayLimit',
    formatter({ seriesSingleDayLimit }) {
      return seriesSingleDayLimit ? seriesSingleDayLimit : '-';
    }
  },
  {
    label: t('冠军限额'),
    prop: 'seriesSingleDayLimit',
    formatter({ seriesSingleDayLimit }) {
      return seriesSingleDayLimit ? seriesSingleDayLimit : '-';
    }
  },

  {
    label: t('动作'),
    prop: 'updateType',
    formatter({ updateType }) {
      if (updateType == 1) return t('禁用');
      else if (updateType == 2) return t('修改');
      else if (updateType == 3) return t('启用');
    }
  },
  {
    label: t('操作人'),
    prop: 'createdBy'
  },
  {
    label: t('时间'),
    prop: 'updatedAt',
    minWidth: 180,
    formatter({ updatedAt }: { updatedAt: string }) {
      return dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss');
    }
  }
];

