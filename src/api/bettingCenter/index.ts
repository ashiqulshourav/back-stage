import { http } from "@/utils/http";
import { searchFormType } from '@/views/operateManager/com/bettingCenter/util/types'

export const bettingCenter = {
  //-结算中心列表
  bettingCenterList: (data: searchFormType) => http.request<any>("post", "/bet-center/list", { data }),
  betcenterRisk: (data: searchFormType) => http.request<any>("post", "/bet-center/risk", { data }),
  orderCancel: (data: {
    orderId: number;
  }) => http.request<any>("post", "/bet-center/cancel", { data }),
  //- 特殊结算
  betSettle: (data: number[]) => http.request<BetOrderAPI.betCenterCancelResType>("post", "/bet-settle/settle", { data }),
  getTenantList: (data: {
    category: number;
  }) => http.request<any>("post", "/bet-center/getTenantList", { data }),
  queryTenantList: (data: {
    category: number;
  }) => http.request<any>("post", "/bet-center/queryTenant", { data }),
  //- 拒绝注单
  riskCancel: (data: { detailId: number; status: number, riskType: string }[]) => http.request<BetOrderAPI.betCenterCancelResType>("post", "/bet-center/risk/cancel", { data }),
  //- 确认注单
  riskConfirm: (data: { detailId: number; status: number }[]) => http.request<BetOrderAPI.betCenterCancelResType>("post", "/bet-center/risk/confirm", { data }),
  // 注单审核列表
  bettingAuditList: (data: searchFormType) => http.request<any>("post", "/bet-center/manualSettlePage", { data }),
  // 注单审核通过
  bettingAuditConfirm: (data: any) => http.request<any>("post", "/bet-center/manualConfirm", { data }),
  // 注单审核拒绝
  bettingAuditReject: (data: any) => http.request<any>("post", "/bet-center/manualReject", { data }),


};
