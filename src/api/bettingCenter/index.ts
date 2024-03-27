import { http } from "@/utils/http";
import {searchFormType} from '@/views/operateManager/bettingCenter/util/types'

export const bettingCenter = {
  //-结算中心列表
  bettingCenterList: (data:searchFormType) => http.request<RoleAPI.allPermissionResType>("post", "/bet-center/list", { data }),
  orderCancel: (data: {
    orderId: number;
  }) => http.request<BetOrderAPI.BetOrderData>("post", "/bet-center/cancel", { data }),
  getTenantList: () => http.request("post", "/bet-center/getTenantList", {}),

};
