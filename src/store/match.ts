import { defineStore } from "pinia";
import { MatchType } from "./types";

export const useMatchStore = defineStore('MATCHSTATE', {
  state: (): MatchType => ({
    leagueList: [],
  }),
  actions: {
    async set_lagueList() {
      if (this.leagueList.length) return;
      const res: MetadataAPI.LeagueListRes = await API.getLeagueList({
        pageSize: 9999,
        pageNum: 1
      });
      this.leagueList = res.data.list;
    }
  },
  persist: {
    enabled: true,
    strategies: [
      { storage: localStorage }
    ]
  }
});
