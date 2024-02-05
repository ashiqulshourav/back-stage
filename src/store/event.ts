import { defineStore } from "pinia";

export const useEventStore = defineStore('EVENTSTORE', {
  state: () => ({
    currentMatch: {},
    eventsList: {}
  }),
  actions: {
    async set_CurrentMatch(matchId) {
      const res = await API.getSettlementList(matchId);
      if (!res.code) this.currentMatch = res.data.list[0];
    },
    async setEventsList(matchId) {
      console.log(matchId);
      const res = await API.getMatchEvents(matchId);
      console.log(res);
      if (!res.code) this.eventsList = res.data;
      else console.log(res);
    }
  }
})