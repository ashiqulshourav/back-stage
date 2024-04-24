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
  type LimitListType = {
    leagueLevel?: number,
    sportId?: number,
    singleUserMaxWin?: number,
    gameType?: number,
    category?: number,
    singleMaxWin?: number,
    maxBetMorning?: number,
    maxBetRolling?: number,
    createdAt?: number,
    updatedAt?: number,
    playMethod?: number,
    round?: number,
    handicapSingleMaxWin?: number,
    handicapWholeMaxBetMorning?: number,
    handicapWholeMaxBetRolling?: number,
    handicapHalfMaxBetMoring?: number,
    handicapHalfMaxBetRolling?: number,
    bigsmallWholeMaxBetRolling?: number,
    bigsmallWholeMaxBetMoring?: number,
    bigsmallHalfMaxBetMoring?: number,
    bigsmallHalfMaxBetRolling?: number,
    bigsmallSingleMaxWin?: number,
    winSingleMaxWin?: number,
    winWholeMaxBetRolling?: number,
    winWholeMaxBetMoring?: number,
    winHalfMaxBetRolling?: number,
    winHalfMaxBetMoring?: number,
    otherSingleMaxWin?: number,
    otherMaxBetRolling?: number,
    otherMaxBetMoring?: number,
    esportSingleMaxWin?: number,
    esportWholeMaxBetMoring?: number,
    esportSingleMaxBetRolling?: number,
    esportSingleMaxBetMoring?: number,
    esportRoundMaxBetRolling?: number,
    esportRoundMaxBetMoring?: number,
    esportWholeMaxBetRolling?: number,
    delFlag?: number, // 1是删除 其他则无感
  };
  type RiskTagListRes = COMMON.BASE_RES_TYPE<RiskTagListType>;
  type RiskTagRes = COMMON.BASE_RES_TYPE<RiskTagType>;
  type LimitRes = COMMON.BASE_RES_TYPE<LimitListType[]>;
  type updateLevelLimitResType = COMMON.BASE_RES_TYPE<null>
}
