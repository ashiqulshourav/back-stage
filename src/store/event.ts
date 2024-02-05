import { defineStore } from "pinia";

export const useEventStore = defineStore('EVENTSTORE', {
  state: () => ({
    currentMatch: {}
  }),
  actions: {
    async set_CurrentMatch(matchId) {
      const res = await API.getSettlementList(matchId);
      if (!res.code) this.currentMatch = res.data.list[0];
    }
  }
})