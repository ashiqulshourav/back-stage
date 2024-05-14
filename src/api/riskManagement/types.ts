declare namespace RiskManagementDataAPI {
  type RiskTagType = {
    id?: number;
    level?: number;
    name?: string;
    count?: number;
    remark?: string;
    labelType?: number;
  };
  type RiskTagListSearchProps = COMMON.ListFetchProps & {
    id?: number;
    level?: number;
    name?: string;
    labelType?: number;
  };
  type RiskTagListType = {
    records: RiskTagType[];
    total: number;
    size?: number;
    current?: number;
    pages?: number;
  };
  type LimitType = {
    id?: number;
    level?: number;
    name?: string;
    count?: number;
    remark?: string;
    labelType?: number;
  };
  type RiskControlTypes = {
    name?: string;
    days?: number;
    betcount?: number;
    profiteAmout?: number;
    profiteRate?: number;
    level?: number;
    labelId?: number;
    lableName?: string | number;
    delFlag?: number; // 1是删除 其他则无感
    minLimitAmount?: number;
    maxLimitAmount?: number;
  };
  type OrderPlacementTypes = {
    id?: number | string;
    sourceCode?: string;
    sourceName?: string;
    eventCode?: string;
    eventName?: string;
    betBeforeTime?: number;
    betAfterTime?: number;
    minLimitAmount?: number;
    maxLimitAmount?: number;
    isDelete?: number;
    createdAt?: string;
    updatedAt?: string;
  };
  type OrderRejectTypes = {
    sourceCode?: string;
    sourceName?: string;
    eventCode?: string;
    eventName?: string;
    betBeforeTime?: number;
    betAfterTime?: number;
    createdAt?: string;
    updatedAt?: string;
    isDelete?: number;
  };
  type LimitListType = {
    leagueLevel: number;
    sportId?: null | number;
    singleUserMaxWin?: null | number;
    gameType?: null | number;
    category?: null | number;
    singleMaxWin?: null | number;
    maxBetMorning?: null | number;
    maxBetRolling?: null | number;
    createdAt?: null | number;
    updatedAt?: null | number;
    playMethod?: null | number;
    round?: null | number;
    handicapSingleMaxWin?: null | number;
    handicapWholeMaxBetMorning?: null | number;
    handicapWholeMaxBetRolling?: null | number;
    handicapHalfMaxBetMoring?: null | number;
    handicapHalfMaxBetRolling?: null | number;
    bigsmallWholeMaxBetRolling?: null | number;
    bigsmallWholeMaxBetMoring?: null | number;
    bigsmallHalfMaxBetMoring?: null | number;
    bigsmallHalfMaxBetRolling?: null | number;
    bigsmallSingleMaxWin?: null | number;
    winSingleMaxWin?: null | number;
    winWholeMaxBetRolling?: null | number;
    winWholeMaxBetMoring?: null | number;
    winHalfMaxBetRolling?: null | number;
    winHalfMaxBetMoring?: null | number;
    otherSingleMaxWin?: null | number;
    otherMaxBetRolling?: null | number;
    otherMaxBetMoring?: null | number;
    esportSingleMaxWin?: null | number;
    esportWholeMaxBetMoring?: null | number;
    esportSingleMaxBetRolling?: null | number;
    esportSingleMaxBetMoring?: null | number;
    esportRoundMaxBetRolling?: null | number;
    esportRoundMaxBetMoring?: null | number;
    esportWholeMaxBetRolling?: null | number;
    delFlag?: null | number; // 1是删除 其他则无感
  };
  type RiskTagListRes = COMMON.BASE_RES_TYPE<RiskTagListType>;
  type RiskTagRes = COMMON.BASE_RES_TYPE<RiskTagType>;
  type LimitRes = COMMON.BASE_RES_TYPE<LimitListType[]>;
  type updateLevelLimitResType = COMMON.BASE_RES_TYPE<null>;
}
