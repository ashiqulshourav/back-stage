const data: OperationLogDataAPI.OperationLog[] = [];

for (let i = 0; i < 50; i++) {
  data.push({
    operationLogId: i + 10000,
    operationAccount: `操作账号-${i}`,
    resourceName: `资源名称-${i}`,
    operationDateTime: new Date().toISOString(),
    successOrNot: i % 2,
    operationType: `操作类型-${i}`,
    uniqueId: i + 10000,
    leagueId: 1 + 1000000,
    beforeOperation: `操作之前-${i} BG Germany 3rd League (Waldhof Mannheim vs SC Ve TX German Football League 3 (Würheim vs Wierla) 284106 BT Germany 3rd League (Waldhof Mannheim vs Verl) 1 LS 3rd league (SV Waldhof Mannheim vs SC Verl) 117 RB 3rd league (SV Waldhof Mannheim 07.vs SC Verl)`,
    afterOperation: `操作之后-${i}`,
    extra: `备注-${i}`
  });
}

const fetchOperationLogList = (
  fetchProps: OperationLogDataAPI.OperationLogListFetchProps
) => {
  return new Promise<OperationLogDataAPI.OperationLogListRes>(
    (resolve, reject) => {
      setTimeout(() => {
        const { pageSize, pageNum } = fetchProps;

        if (data.length < pageSize * (pageNum - 1)) {
          reject("There are no operation Logs match");
        }
        const list = data.filter(
          (_, index) =>
            index >= pageSize * (pageNum - 1) && index < pageSize * pageNum
        );
        resolve({
          code: 0,
          data: { list, total: data.length, pageNum, pageSize },
          msg: ""
        });
      }, 1000);
    }
  );
};

const operationMock = { fetchOperationLogList };

export default operationMock;
