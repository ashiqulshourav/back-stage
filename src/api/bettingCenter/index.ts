import { http } from "@/utils/http";

export const bettingCenter = {
  //-结算中心列表
  bettingCenterList: (data: {
    pageSize: number;
    pageNum: number;
    settleStatus: number;
    betItemId?: number | string;
    sportId?: string | number;
  }) => http.request<RoleAPI.allPermissionResType>("post", "/bet-center/list", { data }),
  orderCancel: (data: {
    orderId: number;
  }) => http.request<BetOrderAPI.BetOrderResType>("post", "/bet-center/cancel", { data }),
  getTenantList: (data: {
    orderId: number;
  }) => http.request("post", "/bet-center/getTenantList", { data }),

};
