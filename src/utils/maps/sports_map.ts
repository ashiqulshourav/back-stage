import { t } from "@/plugins/i18n";

export const SPORT_ID_MAP = [
  { label: t('足球'), value: 1 },
  { label: t('篮球'), value: 2 },
  { label: t('网球'), value: 3 },
  { label: t('电子竞技'), value: 4 },
  { label: t('斯诺克/台球'), value: 5 },
  { label: t('排球'), value: 6 },
  { label: t('特别项目'), value: 7 },
  { label: t('飞镖'), value: 8 },
  { label: t('橄榄球'), value: 9 },
  { label: t('拳击/格斗'), value: 10 },
]

export const MATCH_EVENT_CODE = {
  goal: t('足球进球'),
  yellow_red_card: t('红牌/黄牌'),
  corner: t('角球'),
  match_status: t('比赛阶段'),
}

export const MATCH_STATUS = {
  nover: t('滚球'),
  over: t('比赛结束'),
  nobegin: t('未开始'),
}

// export const PANDA_MATCH_STATUS = {
//   0: t('未匹配'),
//   1: t('成功匹配'),
//   2: t('匹配失败'),
// }

// 开售状态映射
export const OPENING_STATUS = {
  0: t('未开售'),
  1: t('早盘'),
  2: t('滚球'),
}

// 盘口开售状态
export const PLAY_MATCH = {
  HT_AH: {
    Home: t('主'),
    Away: t('客')
  },
  FT_OE: {
    hideMiddle: true,
    Odd: t('单'),
    Even: t('双')
  },
  HT_OU: {
    Over: t('大'),
    Under: t('小')
  },
  FT_OU: {
    Over: t('大'),
    Under: t('小')
  },
  FT_AH: {
    Home: t('主'),
    Away: t('客')
  },
  FT_1X2: {
    hideMiddle: true,
    Home: t('主胜'),
    Away: t('客胜'),
    Draw: t('平')
  },
  HT_OE: {
    hideMiddle: true,
    Odd: t('单'),
    Even: t('双')
  },
  HT_1X2: {
    hideMiddle: true,
    Home: t('主'),
    Away: t('客'),
    Draw: t('平')
  },
};

// 反波胆内容格式化
const BoDanSort = (a: any, b: any) => {
  const [aFirst, aSecond] = a.handicap.split('-');
  const [bFirst, bSecond] = b.handicap.split('-');
  if (aFirst !== bFirst) {
    return parseInt(aFirst) - parseInt(bFirst);
  }
  return parseInt(aSecond) - parseInt(bSecond);
};

// 波胆数据格式转换
export const transferBoDan = (list: any[]) => {
  const listData: any[] = [];
  const list1: any[] = [];
  const list2: any[] = [];
  const list3: any[] = [];
  let other: any = null;
  list.forEach((item) => {
    const temp = { ...item };
    if (temp.handicap === 'AOS') {
      temp.handicap = t('其他');
      other = temp;
    } else {
      const h = temp.handicap.match(/H(\S*)A/)[1];
      const a = temp.handicap.split('A')[1];
      temp.handicap = `${h}-${a}`;
      if (/[0-9]/.test(h) && /[0-9]/.test(a)) {
        if (h > a) list1.push(temp);
        if (h === a) list2.push(temp);
        if (h < a) list3.push(temp);
      }
    }
  });
  list1.sort(BoDanSort);
  list2.sort(BoDanSort);
  list3.sort(BoDanSort);
  if (other) {
    list2.push(other);
  }
  const len = Math.max(list1.length, list2.length, list3.length);
  for (let i = 0; i < len; i++) {
    listData[0 + (i * 3)] = list1[i] || null;
    listData[1 + (i * 3)] = list2[i] || null;
    listData[2 + (i * 3)] = list3[i] || null;
  }
  return listData;
};

export const GET_PLAYNAME_BY_KC = {
  'FT_OU': t('全场大小'),
  'HT_OU': t('半场大小'),
  'FT_OE': t('全场单双'),
  'HT_OE': t('单双-上半场'),
  'FT_AH': t('全场让球'),
  'HT_AH': t('半场让球'),
  'FT_1X2': t('全场独赢'),
  'FT_ML': t('全场独赢'),
  'HT_1X2': t('半场独赢'),
  'HT_ML': t('半场独赢'),
  'FT_CS': t('全场波胆'),
  'HT_CS': t('波胆-上半场'),
  'BothTeamsToScore': t('双方进球'),
  'FTS_AH': t('全场让局'),
  'FTS_OU': t('总局数'),
};