declare namespace VirtualAPI {
  type League = {
    key?: number;
    leagueId: number;
    leagueNameCn: string;
    leagueNameEn: string;
    leagueName: string;
    dataSource: string;
    dataSourceName: string;
    sort: number;
  }
  type LeagueListFetchProps = COMMON.ListFetchProps & {
    leagueId?: number;
  }
  type LeagueListData = COMMON.ListData<League>
  type LeagueListRes = COMMON.ListRes<LeagueListData>

  type Team = {
    key?: number;
    teamId: number;
    teamNameCn: string;
    teamNameEn: string;
    teamName: string;
    dataSource: string;
    dataSourceName: string;
  }
  type TeamListFetchProps = COMMON.ListFetchProps & {
    teamId?: number;
  }
  type TeamListData = COMMON.ListData<Team>
  type TeamListRes = COMMON.ListRes<TeamListData>
}