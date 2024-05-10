import { http } from '@/utils/http';

export const eventData = {
  getPandaMatchEventList: () =>
    http.request<EventAPI.PandaMatchEventListRes>(
      'post',
      '/event/v1/getPandaMatchEventList'
    ),

  getMatchEventByMatchId: (data: EventAPI.PandaMatchEventListParams) =>
    http.request<any>('post', '/event/v1/getMatchEventByMatchId', { data })
};
