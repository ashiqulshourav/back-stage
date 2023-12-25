import { http } from "@/utils/http";

export const metaData = {
  getLeagueList: (data: {
    countryId?: number;
    leagueId?: number;
    leagueId188Bet?: number;
    leagueLogo?: string;
    leagueNameCn?: string;
    leagueNameEn?: string;
    level?: number;
    pageNum?: number;
    pageSize?: number;
    sportId?: number;
  }) => http.request<MetadataAPI.LeagueListRes>("post", "/league/v1/getLeagueList", { data }),

  getTeamList: (data: {
    countryId?: number;
    isCountryTeam?: number;
    leagueId?: number;
    level?: number;
    pageNum?: number;
    pageSize?: number;
    sportId?: number;
    stadiumName?: string;
    teamId?: number;
    teamLogo?: string;
    teamNameCn?: string;
    teamNameEn?: string;
  }) => http.request<MetadataAPI.TeamListRes>("post", "/team/v1/getTeamList", { data }),

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
