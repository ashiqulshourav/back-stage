import { http } from "@/utils/http";

export const esportsSettlement = {
  getESportMatchList: (data: EsportsSettlementAPI.getESportMatchListReqParams) => http.request<ESportsAPI.ESportsLeagueListType>("post", "/eSport/v1/getESportMatchList", { data }),
};
