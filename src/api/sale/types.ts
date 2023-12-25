declare namespace SaleDataAPI {
  type PreSaleList = {
    matchId: number;
    countryId: number;
    sportId: number;
    leagueId: number;
    matchName: string;
    homeTeamId: number;
    awayTeamId: number;
    beginTime: string;
    beginTimeLong: number;
    playingField: string;
    isNeutral: number;
    level: number;
    isSale: number;
    videoUrl: string;
    status: string;
    currentScore: string;
    currentTime: string;
    currentPc: string;
    pandaResult: number;
    pandaMatchId: number;
    matchId188bet: number;
    childrenData: SattleDataAPI.MatchEventsList[];
  }

  type PreSaleListData = {
    total: number;
    list: PreSaleList[];
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

  type PreSaleListRes = {
    code: number;
    msg: string;
    data: PreSaleListData;
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

  /*   type TeamListData = Omit<LeagueListData, 'list'> & { list: TeamList[] }
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
    } */
}