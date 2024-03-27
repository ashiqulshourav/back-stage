import { http } from "@/utils/http";
import {searchFormType} from '@/views/operateManager/bettingCenter/util/types'

export const bettingCenter = {
  //-结算中心列表
  bettingCenterList: (data:searchFormType) => http.request<any>("post", "/bet-center/list", { data }),
  orderCancel: (data: {
    orderId: number;
  }) => http.request<any>("post", "/bet-center/cancel", { data }),
  getTenantList: () => http.request<any>("post", "/bet-center/getTenantList", {}),

};
