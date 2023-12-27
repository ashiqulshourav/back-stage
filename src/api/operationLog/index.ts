// import { http } from "@/utils/http";
import operationMock from "./mock";

export const operationLogData = {
  getOperationLogList: (
    data: OperationLogDataAPI.OperationLogListFetchProps
  ) => {
    // return http.request<OperationLogDataAPI.OperationLogListRes>(
    //   "post",
    //   "/match/v1/getOperationLogList",
    //   {
    //     data
    //   }
    // );
    return operationMock.fetchOperationLogList(data);
  }
};
