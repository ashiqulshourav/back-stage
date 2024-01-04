import { http } from "@/utils/http";

export const metaData = {
  getLeagueList: (data: MetadataAPI.LeagueListParams) => http.request<MetadataAPI.LeagueListRes>("post", "/league/v1/getLeagueList", { data }),

  getTeamList: (data: MetadataAPI.TeamListParamsType) => http.request<MetadataAPI.TeamListRes>("post", "/team/v1/getTeamList", { data }),

  getPlayerList: (data: {
    birthday?: number;
    countryId?: number;
    gender?: number;
    height?: number;
    isCountryPlayer?: number;
    简称?: number;
    picture?: number;
    pageNum?: number;
    pageSize?: number;
    playerId?: string;
    playerNameCn?: number;
    teamId?: string;
  }) => http.request<MetadataAPI.PlayerListRes>("post", "/player/v1/getPlayerList", { data }),

};
