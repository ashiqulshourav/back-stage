import { http } from "@/utils/http";
import { searchFormType } from '@/views/operateManager/bettingCenter/util/types'

export const bettingCenter = {
  //-结算中心列表
  bettingCenterList: (data: searchFormType) => http.request<any>("post", "/bet-center/list", { data }),
  betcenterRisk: (data: searchFormType) => http.request<any>("post", "/bet-center/risk", { data }),
  orderCancel: (data: {
    orderId: number;
  }) => http.request<any>("post", "/bet-center/cancel", { data }),
  //- 特殊结算
  betSettle:  (data: number[]) => http.request<BetOrderAPI.betCenterCancelResType>("post", "/bet-settle/settle", { data }),
  getTenantList: () => http.request<any>("post", "/bet-center/getTenantList", {}),
  //- 拒绝注单
  riskCancel: (data: number[]) => http.request<BetOrderAPI.betCenterCancelResType>("post", "/bet-center/risk/cancel", { data }),
  //- 确认注单
  riskConfirm: (data: number[]) => http.request<BetOrderAPI.betCenterCancelResType>("post", "/bet-center/risk/confirm", { data }),
};
