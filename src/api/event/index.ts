import { http } from '@/utils/http';

export const eventData = {
  getPandaMatchEventList: (data: EventAPI.PandaMatchEventListParams) =>
    http.request<EventAPI.PandaMatchEventList>(
      'post',
      '/event/v1/getPandaMatchEventList',
      { data }
    )
};
