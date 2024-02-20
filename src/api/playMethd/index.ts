import { http } from "@/utils/http";

export const playMethodData = {
  //- 玩法分类赛事列表
  getKindsCodeMatchList: (data: MetadataAPI.LeagueListParams) => http.request<PLayMethodAPI.LeagueListRes>("post", "/match/v1/getKindsCodeMatchList", { data }),
  // -分类列表
  getKindsCodeList: (data: { sportId: number }) => http.request<MetadataAPI.updateLeagueResType>("post", "/kindsCode/v1/getKindsCodeList", { data }),
  //- 新增分类
  addKindsCode: (data: {
    sportId: number | string;
    configValue: string;
    sportName: string;
    tags: string[]
  }) => http.request<MetadataAPI.updateLeagueResType>("post", "/kindsCode/v1/addKindsCode", { data }),
  //- 获取分类标签
  getTags: (data: { sportId: number; }) => http.request<PLayMethodAPI.getTagsRes>("post", "/kindsCode/v1/getTags", { data }),

  updateTeam: (data: MetadataAPI.UpdateTeamParamsType) => http.request<MetadataAPI.TeamListRes>("post", "/team/v1/updateTeam", { data }),

  getCountryList: (data: {
    pageNum: number;
    pageSize: number;
  }) => http.request<MetadataAPI.getCountryListResType>("post", "/country/v1/getCountryList", { data }),

  getPlayerList: (data: {
    birthday?: number;
    countryId?: number;
    gender?: number;
    height?: number;
    isCountryPlayer?: number;
    nickName?: number;
    picture?: number;
    pageNum?: number;
    pageSize?: number;
    playerId?: string;
    playerNameCn?: number;
    teamId?: string;
  }) => http.request<MetadataAPI.PlayerListRes>("post", "/player/v1/getPlayerList", { data }),

};
