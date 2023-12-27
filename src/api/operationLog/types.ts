declare namespace OperationLogDataAPI {
  type OperationLog = {
    operationLogId: number;
    operationAccount: string;
    resourceName: string;
    operationDateTime: string | Date;
    successOrNot: number;
    operationType: string;
    uniqueId: number;
    leagueId: number;
    beforeOperation: string;
    afterOperation: string;
    extra: string;
  };
  type OperationLogListFetchProps = COMMON.ListFetchProps & {
    operationLogId?: number;
  };
  type OperationLogListData = COMMON.ListData<OperationLog>;
  type OperationLogListRes = COMMON.ListRes<OperationLogListData>;
}
