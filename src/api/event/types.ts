declare namespace EventAPI {
  type PandaMatchEventListParams = {
    eventId: number | string;
    eventName: number | string;
    startTime: number | string;
    endTime: number | string;
  };

  type PandaMatchEvent = {
    eventCode?: string;
    eventName?: string;
  };

  type PandaMatchEventList = {
    data: PandaMatchEvent[];
    code?: number;
    msg: string;
  };
}
