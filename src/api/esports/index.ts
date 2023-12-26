// import { http } from "@/utils/http";
import esportsMockAPI from './mock'

export const esportData = {
  getELeagueList: (data: ESportsAPI.LeagueListFetchProps) => {
    // return http.request<ESportsAPI.LeagueListRes>("post", "/league/v1/getLeagueList", { data })
    return esportsMockAPI.fetchEMatchList(data)
  },

  createEMatch: (props: ESportsAPI.League) => {
    // return http.request<ESportsAPI.TeamListRes>("post", "/team/v1/getTeamList", { data })
    return esportsMockAPI.createEMatch(props);
  },

  updateEMatch: (props: ESportsAPI.League) => {
    // return http.request<ESportsAPI.TeamListRes>("post", "/team/v1/getTeamList", { data })
    return esportsMockAPI.updateEMatch(props);
  },

  getETeamList: (data: ESportsAPI.TeamListFetchProps) => {
    // return http.request<ESportsAPI.TeamListRes>("post", "/team/v1/getTeamList", { data })
    return esportsMockAPI.fetchETeamsList(data)
  },

  createETeam: (props: ESportsAPI.Team) => {
    // return http.request<ESportsAPI.TeamListRes>("post", "/team/v1/getTeamList", { data })
    return esportsMockAPI.createETeam(props);
  },

  updateETeam: (props: ESportsAPI.Team) => {
    // return http.request<ESportsAPI.TeamListRes>("post", "/team/v1/getTeamList", { data })
    return esportsMockAPI.updateETeam(props);
  }

};
