import { http } from "@/utils/http";

export const saleData = {
  getPreSaleList: (data: {
    matchId?: number;
    matchName?: number;
    isSale?: number;
    beginTime?: string;
    pageNum?: number;
    sportId?: number;
    pageSize?: number;
  }) => http.request<SaleDataAPI.PreSaleListRes>("post", "/match/v1/getPreSaleList", { data }),

  updateSaleStatus: (data: {
    isSale: number;
    matchId: number;
  }) => http.request<MetadataAPI.TeamListRes>("post", "/match/v1/updateSaleStatus", { data }),

  getMorningSets: (data: {
    matchId?: number;
    matchName?: number;
    isSale?: number;
    beginTime?: string;
    pageNum?: number;
    pageSize?: number;
  }) => http.request<SaleDataAPI.PreSaleListRes>("post", "/match/v1/getMorningSets", { data }),

  getRollingBall: (data: {
    matchId?: number;
    matchName?: number;
    isSale?: number;
    beginTime?: string;
    pageNum?: number;
    pageSize?: number;
  }) => http.request<SaleDataAPI.PreSaleListRes>("post", "/match/v1/getRollingBall", { data }),
};
