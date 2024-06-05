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
    '/event/v1/getMatchEventByMatchId',
    { data }
  ),

  getMatchInfoByMatchId: (data: {
      matchId?: number | string;
  }) =>
    http.request<EventAPI.MatchInfoRes>(
      'post',
      '/event/v1/getMatchInfoByMatchId',
      { data }
    )
};
