declare namespace sportTradingDataAPI {
  type MorningSetMatchListParams = {
    sportId?: number | string;
    leagueNameOrId?: number | string;
    matchNameOrId?: number | string;
    startTime?: number | string;
    endTime?: number | string;
  };

  type MatchDtoList = {
    matchId: number;
    countryId?: any;
    sportId: number;
    leagueId: number;
    matchName: string;
    matchNameEn: string;
    homeTeamId: number;
    awayTeamId: number;
    beginTime: string;
    beginTimeLong: number;
    isSale?: any;
    category: number;
    periodType: number;
    leagueNameCn: string;
    leagueNameEn: string;
    homeTeamNameCn: string;
    homeTeamNameEn: string;
    awayTeamNameCn: string;
    awayTeamNameEn: string;
    dateTime: string;
    status?: any;
    level: number;
    riskLevel: number;
  }

  type getMorningSetMatchListData = {
    type: string;
    matchDtoList: MatchDtoList[];
    size: number;
  }
  type getMorningSetMatchListRes = COMMON.BASE_RES_TYPE<getMorningSetMatchListData[]>

  type BetItemsDtoList = {
    betItemsId: number;
    matchId: number;
    kindsCode: string;
    betItemsName: string;
    betItemsNameEn?: any;
    sourceCode: string;
    sourceBetItemsId: number;
    sourceBetItemsMid: number;
    homeOrAway: string;
    handicap: string;
    handicapEn: null | boolean;
    odds: number;
    dpOdds?: any;
    isSale: number;
    displayIndex: number;
    handicapIndex: number;
    handicapItemIndex: number;
    oddsType: string;
    ctid: number;
    n: string;
    betCount: number;
    betAmount: number;
  }

  type KindsCodeDtoList = {
    betItemsIdList: number[];
    sourceBetItemsMid: number;
    betItemsDtoList: BetItemsDtoList[];
  }

  type MainBetItemsDtoList = {
    betItemsIdList: number[];
    kindsCode: string;
    betItemsName: string;
    betItemsNameEn?: any;
    kindsCodeDtoList: KindsCodeDtoList[];
  }

  type getHandicapItemsData = {
    mainBetItemsDtoList: MainBetItemsDtoList[];
    goalBetItemsDtoList: MainBetItemsDtoList[];
    cornerBetItemsDtoList: MainBetItemsDtoList[];
    cardBetItemsDtoList: MainBetItemsDtoList[];
    overtimeBetItemsDtoList: MainBetItemsDtoList[];
    penaltyKickBetItemsDtoList: MainBetItemsDtoList[];
    specialBetItemsDtoList: MainBetItemsDtoList[];
    mainBetItemsSize: number;
    goalBetItemsSize: number;
    cornerBetItemsSize: number;
    cardBetItemsSize: number;
    overtimeBetItemsSize: number;
    penaltyKickBetItemsSize: number;
    specialBetItemsSize: number;
  }


  type getHandicapItemsRes = COMMON.BASE_RES_TYPE<getHandicapItemsData>
}