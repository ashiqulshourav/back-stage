declare namespace OperateManagementDataAPI {
  type OperateTagType = {
    id?: number;
    labelType?: number;
    level?: number;
    name?: string;
    count?: number;
    remark?: string;
    category?: number;
    labelColor?: string;
  };
  type OperateTagListSearchProps = COMMON.ListFetchProps & {
    id?: number;
    level?: number;
    name?: string;
    category?: number;
    labelType?: number;
    labelColor?: string;
  };
  type OperateTagListType = {
    records: OperateTagType[];
    total: number;
    size?: number;
    current?: number;
    pages?: number;
  };

  type BetBalanceType = {
    userName: string;
    userId: string;
    tenantName: string;
    matchMaxWinLimit: number;
    seriesType1DayMaxLimit: number;
    seriesType2DayMaxLimit: number;
    championDayMaxLimit: number;
  }

  type AccountChangeRecordType = {
    id: string;
    userId: string;
    tenantCode: string;
    operatorId: string;
    balance: number;
    createdAt: string;
    identifier: string;
    isSync: number;
    prevBalance: number;
    remark: string;
    sign: string;
    transAmount: number;
    transNo: string;
    type: number;
    updatedAt: string;
  }

  type AccountChangeRecordListType = {
    pageData: AccountChangeRecordType[];
    count: number;
    pageSize: number;
    pageNumber: number;
    currentPage: number
  }

  type OperateTagListRes = COMMON.BASE_RES_TYPE<OperateTagListType>;
  type OperateTagRes = COMMON.BASE_RES_TYPE<OperateTagType>;
  type BetBalanceRes = COMMON.BASE_RES_TYPE<BetBalanceType>;
  type AccountChangeRecordRes = COMMON.BASE_RES_TYPE<AccountChangeRecordListType>;
  type AccountChangeRes = COMMON.BASE_RES_TYPE;
}
