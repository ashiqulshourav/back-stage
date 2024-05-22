import { http } from "@/utils/http";

export const sportTradingData = {
  //- 早盘赛事列表
  getMorningSetMatchList: (data: sportTradingDataAPI.MorningSetMatchListParams) => http.request<sportTradingDataAPI.getMorningSetMatchListRes>("post", '/operateHandicap/v1/getMorningSetMatchList', { data }),
  //- 滚球赛事列表
  getRollingMatchList: (data: sportTradingDataAPI.MorningSetMatchListParams) => http.request<sportTradingDataAPI.getMorningSetMatchListRes>("post", '/operateHandicap/v1/getRollingMatchList', { data }),
  //- 赛事盘口列表获取
  getHandicapItems: (data: { matchId: number }) => http.request<sportTradingDataAPI.getHandicapItemsRes>("post", "/operateHandicap/v1/getHandicapItems", { data }),
  //- 赛事盘口状态更新
  updateHandicapStatus: (data: sportTradingDataAPI.updateHandicapStatusParams) => http.request<sportTradingDataAPI.updateHandicapStatus>("post", "/operateHandicap/v1/updateHandicapStatus", { data }),
  //- 盘口赔率更新
  updateHandicapOdds: (data: sportTradingDataAPI.updateHandicapOddsParams) => http.request<sportTradingDataAPI.updateHandicapOddsParamsRes>("post", "/operateHandicap/v1/updateHandicapOdds", { data }),
};
