declare namespace ConfigCenterDataAPI {
  type LeagueTagType = {
    id?: number;
    text?: string;
    sportId?: number;
    category?: number;
    leagueId?: number;
    leagueNameCn?: string;
    leagueNameEn?: string;
    tagId?: number;
  };
  type LeagueTagListFetchProps = {
    text?: string;
    sportId?: number;
    category?: number;
    leagueId?: number;
  };
  type LeagueTagListType = COMMON.ListData<LeagueTagType>;
  type ListLeagueTagRes = COMMON.BASE_RES_TYPE<LeagueTagListType>;
  type LeagueTagRes = COMMON.BASE_RES_TYPE<LeagueTagType>;
  type SearchLeagueTagRes = COMMON.BASE_RES_TYPE<LeagueTagType[]>;
}
