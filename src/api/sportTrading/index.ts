import { http } from "@/utils/http";

export const sportTradingData = {
  //- 早盘赛事列表
  getMorningSetMatchList: (data: sportTradingDataAPI.MorningSetMatchListParams) => http.request<sportTradingDataAPI.getMorningSetMatchListRes>("post", '/operateHandicap/v1/getMorningSetMatchList', { data }),
  //- 赛事盘口列表获取
  getHandicapItems: (data: { matchId: number }) => http.request<sportTradingDataAPI.getHandicapItemsRes>("post", "/operateHandicap/v1/getHandicapItems", { data }),
};
