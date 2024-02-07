declare namespace ConfigCenterDataAPI {
  type LeagueTagType = {
    id?: number;
    tagName?: string;
    sportId?: number;
    categoryId?: number;
  };
  type LeagueTagListFetchProps = COMMON.ListFetchProps & {
    tagName?: string;
    sportId?: number;
    categoryId?: number;
  };
  type LeagueTagListType = COMMON.ListData<LeagueTagType>;
  type ListLeagueTagRes = COMMON.BASE_RES_TYPE<LeagueTagListType>;
  type LeagueTagRes = COMMON.BASE_RES_TYPE<LeagueTagType>;
}
