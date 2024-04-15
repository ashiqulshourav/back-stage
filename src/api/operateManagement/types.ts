declare namespace OperateManagementDataAPI {
  type OperateTagType = {
    id?: number;
    level?: number;
    name?: string;
    userCount?: number;
    remark?: string;
  };
  type OperateTagListSearchProps = COMMON.ListFetchProps & {
    id?: number;
    level?: number;
    name?: string;
  };
  type OperateTagListType = COMMON.ListData<OperateTagType>;
  type OperateTagListRes = COMMON.BASE_RES_TYPE<OperateTagListType>;
  type OperateTagRes = COMMON.BASE_RES_TYPE<OperateTagType>;
}
