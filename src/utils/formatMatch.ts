import dayjs from 'dayjs';
import { PLAY_MATCH } from '@/utils/maps/sports_map';
import {addDecimals,truncateDecimals} from './math';
import {EHandicapType, EOddType, ESportType, } from '@/core/constants/enum/sport';
import { TOrder} from '@/core/services/Table';

export const Test = ()=>{
  return 222
}
// 解析当前比分
export const parseMatchScore = (s: string) => {
  const match = s.match(/H(\d+)A(\d+)/);
  if (match) {
    const result = {
      H: parseInt(match[1], 10),
      A: parseInt(match[2], 10)
    };
    return result.H + ' : ' + result.A;
  } else {
    return '-';
  }
}
// 获取结算时主队比分
export const getHomeSettleScore = (s: string) => {
  const match = s.match(/H(\d+)A(\d+)/);
  return parseInt(match[1], 10);
}
//获取结算时客队比分
export const getAwaySettleScore = (s: string) => {
  const match = s.match(/H(\d+)A(\d+)/);
  return parseInt(match[2], 10);
}

export const markeTypeMap = {
  1: t('欧洲盘'),
  2: t('香港盘'),
  3: t('马来盘'),
  4: t('印尼盘'),
  5: t('美式盘'),
  6: t('英式盘')
};

export enum EBetResultType {
  NO_RESULT = 0,
  FLAT = 2,
  LOSE = 3,
  WIN = 4,
  WIN_HALF = 5,
  LOSE_HALF = 6,
  MACHT_CANCLE = 7,
  MACHT_DELAY = 8,
  GAME_DELAY = 11,
  GAME_INTERRUPTED = 12,
  UNKNOWN = 13,
  GAME_ABANDONED = 15,
  ABNORMAL = 16,
  UNKNOWN_STATUS = 17,
  GAME_CANCEL = 18,
  GAME_POSTPONED = 19,
  ROLLBACK = 20,
  CANCELL = 21,
  AUTO_CANCEL = 22,
  HANDLE_CANCEL = 23,
  FLAT_MATCH_ROLLBACK = 51,
}

// export const getViewOddFn = (od: number, type: EOddType, currentOddType: number) => {
//   if (type === EOddType.ML) {
//     od = Number(truncateDecimals(-(1 / od), 2));
//   }
//   if (type !== EOddType.EUROPE) {
//     return truncateDecimals(Number(currentOddType === EOddType.EUROPE ? addDecimals(od, 1) : od), 2);
//   }
//   return truncateDecimals(od, 2);
// };

export const BET_RESULT_TYPE_MAP: { [key in EBetResultType]: string } = {
  [EBetResultType.NO_RESULT]: '无结果',
  [EBetResultType.FLAT]: '走水',
  [EBetResultType.LOSE]: '输',
  [EBetResultType.WIN]: '赢',
  [EBetResultType.WIN_HALF]: '赢半',
  [EBetResultType.LOSE_HALF]: '输半',
  [EBetResultType.MACHT_CANCLE]: '赛事取消',
  [EBetResultType.MACHT_DELAY]: '赛事延期',
  [EBetResultType.GAME_DELAY]: '比赛延迟',
  [EBetResultType.GAME_INTERRUPTED]: '比赛中断',
  [EBetResultType.UNKNOWN]: '未知',
  [EBetResultType.GAME_ABANDONED]: '比赛放弃',
  [EBetResultType.ABNORMAL]: '异常盘口',
  [EBetResultType.UNKNOWN_STATUS]: '未知赛事状态',
  [EBetResultType.GAME_CANCEL]: '比赛取消',
  [EBetResultType.GAME_POSTPONED]: '比赛延期',
  [EBetResultType.ROLLBACK]: '回滚',
  [EBetResultType.CANCELL]: '注单取消',
  [EBetResultType.HANDLE_CANCEL]: '注单取消',
  [EBetResultType.AUTO_CANCEL]: '预约失效',
  [EBetResultType.FLAT_MATCH_ROLLBACK]: '走水', // 比分回滚取消结算返还金额,算走水
};



export const playMap = {
  FT_OU: t('全场大小'),
  HT_OU: t('半场大小'),
  FT_OE: t('全场单双'),
  HT_OE: t('单双-上半场'),
  FT_AH: t('全场让球'),
  HT_AH: t('半场让球'),
  FT_1X2: t('全场独赢'),
  Winner: t('全场独赢'),
  FT_ML: t('全场独赢'),
  HT_1X2: t('半场独赢'),
  HT_ML: t('半场独赢'),
  FT_CS: t('全场波胆'),
  HT_CS: t('波胆-上半场'),
  FTS_AH: t('全场让局'),
  FTS_OU: t('总局数'),
  BothTeamsToScore: t('双方进球'),
};

export const formatSeriesType=(seriesType: number, len: number)=>{
  switch (seriesType) {
    case 10001013: return '10串1013';
    case 10001: return '10串1';
    default:
      return perSeriesStr(seriesType, len);
  };
}

export const perSeriesStr = (type: number, len:number)=>{
  const frist = String(type).charAt(0);
  if (Number(frist) === len) {
    return String(type).replace('00', '串');
  }
  return String(type).charAt(0)+'串1';
};
export const isVisiableSecondText = (betHandicap: string, betN: string, kc: string)=>{
  if (betN) return false;
  if (kc && kc.endsWith('_TG')) return false;
  // 只有数字才显示
  const temp = Number(betHandicap.split('/')[0]);
  if (!isNaN(temp) && isFinite(temp)) return true;
  return false;
};

// 获取注单玩法中具体数值或直接返回空-适用于下注时本地数据展示
export const getBetHandiCapAtBetting = (name: string, sprotId?: number)=>{
  // 电子竞技-过滤
  if (sprotId && sprotId > 33) {
    return '';
  }
  return name;
};

export const useSportFormatDetail = (row) => {
  let score: string;
  if (row.kindsCode === 'FT_CS' || row.kindsCode === 'HT_CS') {
    score = parseMatchScore(row.betHandicap);
  } else {
    const type = row.betHomeOrAway ? row.betHomeOrAway : row.betHandicap;
    score =
        PLAY_MATCH(row.kindsCode, row.homeTeamNameCn, row.awayTeamNameCn)[
            type
            ] ?? row.betHandicap ?? '-';
  }
  const firstLine = `${row.sportNameCn} ${dayjs(row.createTime).format(
      'YYYY-MM-DD HH:mm:ss'
  )}`;
  const secondLine = row.leagueNameCn;
  const thirdLine = `${row.homeTeamNameCn} vs ${row.awayTeamNameCn}`;
  const fifthLine = `玩法: ${playMap[row.kindsCode] ?? row.betItemName ?? '-'}`;
  const odd=getViewOddFn(row.oddFinally,row.marketTypeFinally,row.marketType)
  const oddName=  getBetTeamType(row || {} as Detail)
  const isvisiable=isVisiableSecondText(row.betHandicap, row.betN, row.kindsCode)
  const oddName2=getBetHandiCapAtBetting(row.betHandicap, row.sportId)
  const fourthLine = `${oddName}  ${isvisiable?oddName2:''} @${odd} (${markeTypeMap[row.marketType]})`;
  return [firstLine, secondLine, thirdLine, fourthLine, fifthLine,score];
}
// 盘口类型, OU:欧盘,1; HK:香港盘,2; ML:马来盘,3; ID:印尼盘,4; US:美式盘,5; GB:英式盘,6;

export type Detail = {
  orderId: number;
  marketType: EHandicapType;
  oddFinally: number;
  sportId: ESportType;
  sportNameCn: string;
  sportNameEn: string;
  matchId: number;
  matchName: string;
  scoreBenchmark?: string; // 根据实际情况可能需要调整
  settleScore:string;
  leagueId: number;
  leagueNameEn?: string; // 根据实际情况可能需要调整
  leagueNameCn?: string; // 根据实际情况可能需要调整
  betItemId: number;
  betItemName: string;
  createTime: string;
  homeTeamNameEn: string;
  awayTeamNameEn: string;
  homeTeamNameCn: string;
  awayTeamNameCn: string;
  betResult: EBetResultType;
  kindsCode?:string;
  betHomeOrAway?:string;
  betHandicap?:string;
  isInplay:number;
  beginTime:string
  settleTime:string
  betItemCTID: number;
  oddValue:number;
  betN: string;
};
// 获取投注球队或其他玩法---------适用于已投注接口数据返回
export const getBetTeamType = (info:Detail)=>{
  const {betHomeOrAway, betHandicap, kindsCode} = info;
  const createOrderTmp = {
    teams: {
      home: {
        name: info.homeTeamNameCn,
      },
      away: {
        name: info.awayTeamNameCn,
      },
    },
  };
  return getOrderBetTypeAtBetting({betName: info.betN, betTeam: betHomeOrAway ?betHomeOrAway : betHandicap, orderName: betHandicap, ...createOrderTmp, kc: kindsCode} as any);
};

// 转换 投注项名称
export const getNameByhoa = (name: string, kc?: string, TOrder?: TOrder, inMainList = false) => {
  if (kc === 'FT_HF') {
    const map: any = {
      'H': TOrder.teams.home.name,
      'A': TOrder.teams.away.name,
      'D': '和',
    };
    return name.split('').map((item) => map[item]).join(' / ');
  } else if (kc && kc.endsWith('_TG')) {
    return name.includes('UP') ? name.replace('UP', '及以上') : name.split('').join('~');
  } else if (kc === 'FT_TTS') {
    if (name.toUpperCase() === 'FIRST') return '无进球';
  }
  if (inMainList && (name === TOrder.teams.home.name || name === TOrder.teams.away.name)) {
    if (name === TOrder.teams.home.name) return '主';
    if (name === TOrder.teams.away.name) return '客';
  }
  switch (name?.toUpperCase()) {
    case 'HOME':
      return '主';
    case 'AWAY':
      return '客';
    case 'DRAW':
      return '平局';
    case 'ODD':
      return '单';
    case 'EVEN':
      return '双';
    case 'OVER':
      return '大';
    case 'UNDER':
      return '小';
    case 'FIRST':
      return '首个进球';
    case 'LAST':
      return '最后进球';
    default:
      return name;
  }
};
export const assertHomeAwayScore = (scoreString:string) => {
  if (!scoreString) return '';
  const score = scoreString.replace('A', ' ').replace('H', '').split(' ');
  if (!score) return '';
  return score;
};
// 获取注单玩法具体详情-----------适用于下注时本地数据展示
type TeamType = 'home' | 'away' | undefined;
export const getOrderBetTypeAtBetting = (order:TOrder)=>{
  const {betTeam, orderName, teams, kc} = order;
  const lname = betTeam.toLowerCase();
  if (['FT_TTS'].includes(order.kc)) {
    if (betTeam ==='Draw') return '无进球';
    return orderName==='Last'? `最后进球/${order.betName}`:`首个进球/${order.betName}`;
  }
  if (order.betName) {
    return order.betName;
  }
  if (kc && kc.endsWith('_TG')) {
    return getNameByhoa(betTeam, kc, order);
  }
  if (['FT_CS', 'HT_CS'].includes(order.kc)) {
    if (orderName ==='AOS') return '其他';
    const [home, away]= assertHomeAwayScore(orderName);
    return home +'-' + away;
  }

  if (kc === 'FT_HF') {
    return getNameByhoa(betTeam, kc, order);
  }
  if (betTeam === orderName && ['home', 'away'].includes(lname)) {
    return teams[lname as TeamType].name;
  }
  if (betTeam === orderName && !['home', 'away'].includes(lname)) {
    return getNameByhoa(betTeam);
  }
  if (betTeam !== orderName && ['over', 'under'].includes(lname)) {
    return getNameByhoa(betTeam);
  }
  if (betTeam !== orderName && ['home', 'away'].includes(lname)) {
    return teams[lname as TeamType].name;
  }

  return orderName;
};
