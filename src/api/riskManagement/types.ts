declare namespace RiskManagementDataAPI {
  type RiskTagType = {
    id?: number;
    level?: number;
    name?: string;
    userCount?: number;
    remark?: string;
  };
  type RiskTagListSearchProps = COMMON.ListFetchProps & {
    id?: number;
    level?: number;
    name?: string;
  };
  type RiskTagListType = COMMON.ListData<RiskTagType>;
  type RiskTagListRes = COMMON.BASE_RES_TYPE<RiskTagListType>;
  type RiskTagRes = COMMON.BASE_RES_TYPE<RiskTagType>;
}
