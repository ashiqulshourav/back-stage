declare namespace OperateManagementDataAPI {
  type OperateTagType = {
    id?: number;
    labelType?: number;
    level?: number;
    name?: string;
    userCount?: number;
    remark?: string;
    category?: number;
  };
  type OperateTagListSearchProps = COMMON.ListFetchProps & {
    id?: number;
    level?: number;
    name?: string;
    category?: number;
    labelType?: number;
  };
  type OperateTagListType = {
    records: OperateTagType[];
    total: number;
    size?: number;
    current?: number;
    pages?: number;
  };
  type OperateTagListRes = COMMON.BASE_RES_TYPE<OperateTagListType>;
  type OperateTagRes = COMMON.BASE_RES_TYPE<OperateTagType>;
}
