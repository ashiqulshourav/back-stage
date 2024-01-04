declare namespace MetadataAPI {
  type LeagueListParams = {
    pageNum: number
    pageSize: number;
    countryId?: number;
    leagueId?: number;
    leagueId188Bet?: number;
    leagueLogo?: string;
    leagueNameCn?: string;
    leagueNameEn?: string;
    level?: number;
    sportId?: number;
  }

  type LeagueList = {
    leagueId: number | string;
    sportId: number | string;
    countryId: number | string;
    leagueNameCn: string;
    leagueNameEn: string;
    leagueLogo: string;
    leagueId188Bet: number | string;
    level: string | number;
  }
  type LeagueListData = {
    total: number;
    list: LeagueList[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
  }
  type LeagueListRes = {
    code: number;
    msg: string;
    data: LeagueListData;
  }


  type TeamList = {
    teamId: number;
    countryId: number;
    sportId: number;
    leagueId: number;
    teamNameCn: string;
    teamNameEn: string;
    teamLogo: string;
    level: number;
    isCountryTeam?: number;
    [key: string]: any;
  }
  type TeamListData = Omit<LeagueListData, 'list'> & { list: TeamList[] }
  type TeamListRes = {
    code: number;
    msg: string;
    data: TeamListData;
  }

  type PlayerList = {
    birthday: string;
    countryId: number;
    gender: string;
    height: number;
    isCountryPlayer: number;
    nickName: string;
    pageNum: number;
    pageSize: number;
    picture: string;
    playerId: number;
    playerNameCn: string;
    teamId: number;
  }

  type PlayerListData = Omit<LeagueListData, 'list'> & { list: PlayerList[] }
  type PlayerListRes = {
    code: number;
    msg: string;
    data: PlayerListData;
  }

  type TeamListParamsType = {
    pageNum: number;
    pageSize: number;
    countryId?: number;
    isCountryTeam?: number;
    leagueId?: number;
    level?: number;
    sportId?: number;
    stadiumName?: string;
    teamId?: number;
    teamLogo?: string;
    teamNameCn?: string;
    teamNameEn?: string;
  }
}