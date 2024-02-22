import { http } from '@/utils/http';
import mockAPI from './mock';

export const configCenterData = {
  //- 联赛标签
  getLeagueTagList: (data: ConfigCenterDataAPI.LeagueTagListFetchProps) =>
    http.request<ConfigCenterDataAPI.ListLeagueTagRes>(
      'post',
      '/league/tag/search',
      { data }
    ),
  // mockAPI.getLeagueTagList(data),

  searchLeagueTagList: (id: number) =>
    http.request<ConfigCenterDataAPI.ListLeagueTagRes>(
      'get',
      '/league/tag/leagueToTagByTagId/' + id
    ),
  // mockAPI.searchLeagueTagList(data),

  updateLeagueTag: (data: ConfigCenterDataAPI.LeagueTagType) =>
    http.request<ConfigCenterDataAPI.LeagueTagRes>(
      'post',
      '/league/tag/update',
      {
        data
      }
    ),
  // mockAPI.updateLeagueTag(data),
  createLeagueTag: (data: ConfigCenterDataAPI.LeagueTagType[]) =>
    http.request<ConfigCenterDataAPI.LeagueTagRes>(
      'post',
      '/league/tag/create',
      {
        data
      }
    ),
  // mockAPI.createLeagueTag(data),
  deleteLeagueTag: (data: ConfigCenterDataAPI.LeagueTagType) =>
    http.request<
      COMMON.BASE_RES_TYPE<null | ConfigCenterDataAPI.LeagueTagType[]>
    >('post', '/league/tag/del', {
      data
    }),
  // mockAPI.deleteLeagueTag(data)
  bulkDeleteLeagueTag: (data: number[]) =>
    http.request<COMMON.BASE_RES_TYPE<null>>(
      'post',
      'league/tag/leagueToTag/batchDelete',
      {
        data
      }
    )
};
