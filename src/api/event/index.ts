import { http } from '@/utils/http';

export const eventData = {
  getPandaMatchEventList: () =>
    http.request<EventAPI.PandaMatchEventListRes>(
      'post',
      '/event/v1/getPandaMatchEventList'
    ),

  getMatchEventByMatchId: (data: EventAPI.PandaMatchEventListParams) =>
    http.request<EventAPI.MatchEvent[]>(
      'post',
      '/event/v1/getMatchEventByMatchId',
      { data }
    ),

  getMatchInfoByMatchId: (data: any) =>
    http.request<EventAPI.MatchInfoRes>(
      'post',
      '/event/v1/getMatchInfoByMatchId',
      { data }
    )
};
