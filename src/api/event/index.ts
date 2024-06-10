import { http } from '@/utils/http';

export const eventData = {
  getPandaMatchEventList: () =>
    http.request<EventAPI.PandaMatchEventListRes>(
      'post',
      '/event/v1/getPandaMatchEventList'
    ),

  getMatchEventByMatchId: (data: EventAPI.PandaMatchEventListParams) =>
    http.request<EventAPI.MatchEventRes>(
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
      { data }
    )
};
