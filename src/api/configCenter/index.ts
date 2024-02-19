import { http } from '@/utils/http';
import mockAPI from './mock';

export const configCenterData = {
  //- 联赛标签
  getLeagueTagList: (data: ConfigCenterDataAPI.LeagueTagListFetchProps) =>
    // http.request<ConfigCenterDataAPI.ListLeagueTagRes>(
    //   'post',
    //   '/leagueTag/v1/getLeagueTagList',
    //   { data }
    // ),
    mockAPI.getLeagueTagList(data),

  searchLeagueTagList: (data: ConfigCenterDataAPI.LeagueTagType) =>
    // http.request<ConfigCenterDataAPI.ListLeagueTagRes>(
    //   'post',
    //   '/leagueTag/v1/getLeagueTagList',
    //   { data }
    // ),
    mockAPI.searchLeagueTagList(data),

  updateLeagueTag: (data: ConfigCenterDataAPI.LeagueTagType) =>
    // http.request<ConfigCenterDataAPI.LeagueTagRes>(
    //   'post',
    //   '/leagueTag/v1/updateLeagueTag',
    //   { data }
    // ),
    mockAPI.updateLeagueTag(data),
  createLeagueTag: (data: ConfigCenterDataAPI.LeagueTagType) =>
    // http.request<ConfigCenterDataAPI.LeagueTagRes>(
    //   'post',
    //   '/leagueTag/v1/createLeagueTag',
    //   { data }
    // ),
    mockAPI.createLeagueTag(data),
  deleteLeagueTag: (data: ConfigCenterDataAPI.LeagueTagType) =>
    // http.request<COMMON.BASE_RES_TYPE<null>>(
    //   'post',
    //   '/leagueTag/v1/deleteLeagueTag',
    //   { data }
    // )
    mockAPI.deleteLeagueTag(data)
};
