import { http } from "@/utils/http";

export const saleData = {
  getPreSaleList: (data: SaleDataAPI.SaleListFetchProps) => http.request<SaleDataAPI.SaleListRes>("post", "/match/v1/getPreSaleList", { data }),

  updateSaleStatus: (data: {
    isSale: number;
    matchId: number;
  }) => http.request<MetadataAPI.TeamListRes>("post", "/match/v1/updateSaleStatus", { data }),

  getMorningSets: (data: SaleDataAPI.SaleListFetchProps) => http.request<SaleDataAPI.SaleListRes>("post", "/match/v1/getMorningSets", { data }),

  getRollingBall: (data: SaleDataAPI.SaleListFetchProps) => http.request<SaleDataAPI.SaleListRes>("post", "/match/v1/getRollingBall", { data }),
};
