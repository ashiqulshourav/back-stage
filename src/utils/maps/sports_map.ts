import { t } from "@/plugins/i18n";

export const SPORT_ID_MAP = [
  { label: t('足球'), value: 1, type: 'FootBall' },
  { label: t('篮球'), value: 2, type: 'BasketBall' },
  { label: t('网球'), value: 3, type: 'Tennis' },
  // { label: t('电子竞技'), value: 4, type: 'FootBall' },
  { label: t('斯诺克/台球'), value: 5, type: 'Billiards' },
  { label: t('排球'), value: 6, type: 'Volleyball' },
  { label: t('特别项目'), value: 7, type: 'SpecialProjects' },
  { label: t('飞镖'), value: 8, type: 'Darts' },
  { label: t('橄榄球'), value: 9, type: 'Rugby' },
  { label: t('拳击/格斗'), value: 10, type: 'Boxing' },
]



export const ESPORT_ID_MAP = [
  { value: 276, label: 'DOTA2', },
  { value: 277, label: 'CS2', },
  { value: 278, label: '英雄联盟', },
  { value: 279, label: '王者荣耀', },
  { value: 280, label: 'LOL:激斗峡谷', },
  { value: 281, label: '永劫无间', },
  { value: 282, label: '无尽对决', },
  { value: 285, label: '传说对决', },
  { value: 286, label: '无畏契约', },
  { value: 287, label: 'MMA', },
  { value: 288, label: '绝地求生', },
  { value: 289, label: '穿越火线', },
  { value: 290, label: '守望先锋', },
  { value: 291, label: '星际争霸II', },
  { value: 292, label: '火箭联盟', },
  { value: 293, label: '彩虹六号', },
  { value: 294, label: '炉石传说', },
  { value: 295, label: 'FIFA', },
  { value: 296, label: '使命召唤', },
  { value: 297, label: '魔兽争霸3', },
]



export const MATCH_EVENT_CODE = {
  goal: t('足球进球'),
  yellow_red_card: t('红牌/黄牌'),
  corner: t('角球'),
  yellow_card: t('黄牌'),
  red_card: t('黄牌'),
  // match_status: t('比赛阶段'),
}

export const MATCH_STATUS = {
  nover: t('滚球'),
  over: t('比赛结束'),
  nobegin: t('未开始'),
}
export const ESPORT_MATCH_STATUS = {
  nover: t('比赛中'),
  over: t('比赛结束'),
  nobegin: t('未开赛'),
  canceled: t('比赛取消'),
}

//- 上半场 ｜ 下半场
export const MATCH_LEVEL = {
  6: t('上半场'),
  7: t('下半场')
}

//- 主队 ｜ 客队
export const HOME_AWAY = {
  home: t('主队'),
  away: t('客队')
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
  3: t('进行中'),
}
export const MATCH_PERIOD = {
  Q1: ' 第一节',
  Q2: ' 第二节 ',
  Q3: ' 第三节 ',
  Q4: ' 第四节 ',
  OT: ' 加时赛',
  HT: '上半场',
  FT: ' 全场',
}
//- 盘口状态
export const HANDICAP_STATUS = {
  0: t('未锁盘'),
  1: t('锁盘'),
}

export const YELLOW_OR_RED = {
  'yellow_card': 1,
  'red_card': 2
}

// 玩法映射
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
  'Outright': t('冠军玩法'),
};

export const SPORT_CATEGORY = [
  { label: t('普通体育'), value: 0 },
  { label: t('电子竞技'), value: 1 },
  { label: t('虚拟体育'), value: 2 },
]

export enum LeagueClassifyType {
  SPORT_CLASSIFY = 0,
  ESPORT_CLASSIFY = 1,
  VIRTUAL_SPORT_CLASSIFY = 2,
}