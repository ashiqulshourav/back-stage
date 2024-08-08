import { http } from '@/utils/http';

export const eventData = {
  getPandaMatchEventList: () =>
    http.request<EventAPI.PandaMatchEventListRes>(
      'post',
      '/event/v1/getPandaMatchEventList'
    ),

  getMatchEventByMatchId: (data: EventAPI.PandaMatchEventListParams) =>
    http.request<EventAPI.getMatchEventByMatchIdResType>(
      'post',
      '/event/v1/getMatchEventByMatchId',
      { data }
    ),

  matchEventDataExport: (data: EventAPI.PandaMatchEventListParams) =>
    http.request<EventAPI.MatchEventRes>(
      'post',
      '/event/v1/getMatchEventByMatchId/excel',
      { data }
    ),

  getMatchInfoByMatchId: (data: {
    matchId?: number | string;
  }) =>
    http.request<EventAPI.MatchInfoRes>(
      'post',
      '/event/v1/getMatchInfoByMatchId',
      { data }
    ),
  //- 获取赛事+注单动画
  getMatchStatistic: (data: {
    matchId: string | number
  }) =>
    http.request<EventAPI.getMatchStatusticResType>('post', '/matchData/v1/getMatchStatistic',
      { data },
      { noNprogress: true }
    ),
  //- 获取制定注单
  getMatchBetList: (data: {
    matchId: number | string;
    startMinutes: number;
    pageSize: number;
    pageNum: number;
  }) =>
    http.request<EventAPI.getMatchBetListResType>('post', '/matchData/v1/getMatchBetList',
      { data },
      {
        noNprogress: true
      }
    ),

  //- 赛事赔率记录列表
  /* /match/v1/oddsHistoryMatchList */
  /*
  @Schema(description = "联赛杯赛ID")
    Integer leagueId;
@Schema(description = "赛事ID")
    Long matchId;
@Schema(description = "赛事状态:nover未结束，over已结束,delay比赛延迟,interrupt比赛中断,abandon比赛放弃,postponed 比赛延期")
    String status;
@Schema(description = "查询开始时间")
    private String startTime;
@Schema(description = "查询结束时间")
    private String endTime;

   */
  oddsHistoryMatchList: (data: {
    leagueId?: number | string;
    matchId: number | string;
    pageSize: number;
    pageNum: number;
  }) =>
    http.request<EventAPI.getMatchBetListResType>('post', '/match/v1/oddsHistoryMatchList',
      { data },
      {
        noNprogress: true
      }
    ),
};
