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
  type RiskTagListRes = COMMON.BASE_RES_TYPE<RiskTagListType>;
  type RiskTagRes = COMMON.BASE_RES_TYPE<RiskTagType>;
}
