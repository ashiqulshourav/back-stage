
export type accountChangeRecordSearchFormType = {
  pageSize?: number | string;
  pageNum?: number | string;
  endCreatedAt: string | number,
  startCreatedAt: string | number,
  userId: string
}


export type modifyBalanceFormType = {
  userId: string,
  amount: number,
  accountChangeTypeCode: number,
  remark: string,
}