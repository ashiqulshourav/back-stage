import { defineStore } from 'pinia';

export const useBettingAuditStore = defineStore('BETTING_AUDIT', {
  state: (): any => ({
    dataFetchingTime: 60
  }),
  actions: {
    async setDataFetchingTime(time: number) {
      this.dataFetchingTime = time;
      console.log('111', this.dataFetchingTime);
    }
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }]
  }
});
