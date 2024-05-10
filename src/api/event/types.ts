declare namespace EventAPI {
  type PandaMatchEventListParams = {
    matchId?: '';
    eventSource?: string;
    eventCode?: '';
    startTime?: number | string;
    endTime?: number | string;
    pageSize?: number;
    pageNum?: number;
  };

  type PandaMatchEventList = {
    eventCode: string;
    eventName: string;
  };

  type PandaMatchEventListRes = {
    data: {
      eventCode?: string;
      eventName?: string;
    }[];
  };

  type MatchEvent = {
    aTeamName: string;
    hTeamName: string;
    league: string;
    matchEventList: [];
    matchId: number;
    sportName: string;
    startDateTime: string;

    /**
     * 
     * 
aTeamName
: 
"阿卜杜拉.谢尔巴赫（约旦）"
hTeamName
: 
"博尔纳.科利克(克罗地亚)"
league
: 
"ATP奧蒂尼-新魯汶挑战赛"
matchEventList
: 
[]
matchId
: 
33333
sportName
: 
"网球"
startDateTime
: 
"2024-01-27 04:00:00"
     */
  };

  type matchEventList = {
    matchEventList: MatchEvent[];
    code?: number;
    msg: string;
  };
}
